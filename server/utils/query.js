const query = {
    list: async (model, config = {
        find: {},
        select: {},
        search: {},
        pagination: {},
        filters: [],
        populates: [],
        sort: {},
    }) => {
        let { find, select, search, pagination, filters, populates, sort } = { ...config };
        const perPage = pagination?.perPage ? pagination.perPage : 10;
        const page = pagination?.page ? pagination.page - 1 : 0;
        const keyword = search?.keyword ? search.keyword : "";
        const fields = search?.fields ? search.fields : [];
        find = find ? find : {};
        filters = filters ? filters : [];
        select = select ? select : {};
        sort = sort ? sort : {createdAt: -1};
        let query = {};

        if (keyword && fields) {
            query = fields.map((field) => {
                let obj = {};
                obj[field] = { $regex: `${keyword}`, $options: "i" };
                return obj;
            });
        }

        let whereIns = filters.map((filter) => {
            let obj = {};
            if (filter.values.length > 0)
                obj[filter.field] = { $in: filter.values };
            return obj;
        });

        whereIns = whereIns.length > 0 ? whereIns : {};

        const count = await model.find(find).or(query).and(whereIns).count();
        let data = model
            .find(find)
            .select(select)
            .or(query)
            .and(whereIns)
            .limit(perPage)
            .skip(perPage * page)
            .sort(sort);
        populates?.map(
            (populate) => (data = data.populate(populate.path, populate.select))
        );

        return { data: await data.lean(), keyword: keyword, total: count, currentPage: page + 1, lastPage: Math.ceil(count / perPage) };
    },
    view: async (model, id, config) => {
        const { populates } = { ...config };

        let data = model.findById(id);

        populates?.map(
            (populate) => (data = data.populate(populate.path, populate.select))
        );

        return await data;
    },
    insert: async (model, data) => {
        const doc = new model(data);
        await doc.save();
        return doc;
    },
    update: async (model, id, data) => {
        const doc = await model.findById(id);
        if (!doc) throw { name: "IdNotFound", message: "Id not found" };
        Object.keys(data).map(key => doc[key] = data[key]);
        await doc.save();
        return doc;
    },
    delete: async (model, id) => {
        const doc = await model.findOneAndDelete({ _id: id });
        if (!doc) throw { name: "IdNotFound", message: "Id not found" };

        return doc;
    },
};

module.exports = query;
