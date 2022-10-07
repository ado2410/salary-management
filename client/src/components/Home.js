import {Route, Routes} from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";
import {Box} from "@mui/material";
import PostIndex from "./posts/Index";
import SalaryIndex from "./salaries/Index";
import FrontView from "./salaries/FrontView";

function Home() {
    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "99vh"}}>
            <Box sx={{pb: 1}}>
                <Header />
            </Box>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/posts" element={<PostIndex />} />
                <Route path="/salaries" element={<SalaryIndex />} />
                <Route path="/salaries/:id" element={<FrontView />} />
            </Routes>
            <Box sx={{pt: 1}}/>
        </Box>
    );
}

export default Home;