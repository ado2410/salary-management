# Website quản lý thu nhập cá nhân cho Cán bộ và Giảng viên UDCK
## I.Giới thiệu
Trong quá trình chuyển đổi số thì việc tính lương và quản lý thu nhập của nhân viên trong các cơ quan, tổ chức doanh nghiệp hiện đang là vấn đề rất được quan tâm. Hiện tại trên thị trường đã xuất hiện các phần mềm quản lý cho doanh nghiệp vừa và nhỏ và có các công cụ hỗ trợ tính lương như ECount, FastWork và Base HMR+… Tuy nhiên theo tìm hiểu, các cơ quan – tổ chức và doanh nghiệp chỉ có 2 hướng quản lý thu nhập:
- Thứ nhất là quản lý lương bằng phần mềm Excel, sau đó gửi bảng lương cho ngân hàng và ngân hàng sẽ gửi tin nhắn SMS hoặc thông qua ứng dụng của ngân hàng về số tiền lương nhận được đến từng CB-GV.
- Thứ hai là quản lý, tính thu nhập của từng nhân viên thông qua phần mềm chuyên dụng nhưng không thể gửi chi tiết lương đến cho từng nhân viên mà vẫn chỉ gửi bảng lương đó cho bên ngân hàng để ngân hàng chi trả lương.
<br/>
 Còn tại Phân hiệu ĐHĐN tại Kon Tum, các nhân viên Phòng KH-TC cũng đang quản lý lương của các CB-GV theo hướng thứ nhất đó là quản lý bằng file excel, và nhận thông báo lương qua tin nhắn từ ngân hàng. Tuy nhiên theo phương thức quản lý này sẽ gặp rất nhiều bất cập như sau: CB-GV không thể theo dõi được chi tiết bảng lương của bản thân bao gồm những khoản gì và có sự thay đổi bất thường như thế nào cũng như gặp bất tiện trong việc thống kê tổng thu nhập theo tháng hoặc theo năm. Hơn thế nữa nếu việc tính lương có sai sót hàng loạt thì CB-GV sẽ gửi rất nhiều phản hồi đến hộp thư email của CB-GV và việc phản hồi, giải thích các thắc mắc này sẽ gây tốn rất nhiều thời gian cho Phòng KH-TC.<br/>
Do đó, nhóm chúng em chọn đề tài “Website quản lý thu nhập cá nhân cho Cán bộ-Giảng viên UDCK” để nghiên cứu nhằm hỗ trợ Nhà trường hoàn thiện hơn chương trình chuyển đổi số và phù hợp với xu hướng của thời đại, cũng như giúp CB-GV và nhân viên Phòng KH-TC giảm thiểu thời gian và công sức trong việc quản lý thu nhập tại UDCK.

## What up
## II. Công nghệ sử dụng
| ![image](https://user-images.githubusercontent.com/15710296/194469617-7c49e50d-2b07-46f7-bf4f-7236e6a0eec2.png) |
|:--:|
| *Sơ đồ mô tả công nghệ sử dụng* |
## III. Các chức năng
| STT |	Chức năng |	Vấn đề được giải quyết |
|:-:| - | - |
| 1 |	Xây dựng CSDL lưu trữ thu nhập cá nhân | Có một CSDL trung tâm lưu trữ dữ liệu thu nhập. Không cần phải quản dữ liệu một cách rời rạc bằng file excel và không thống nhất |
| 2 |	Xây dựng chức năng xem lương |	CB-GV chủ động xem lương mà không cần yêu cầu bộ phận KHTC |
| 3	| Xây dựng chức năng nhập lương	| Nhanh chóng nhập dữ liệu lương từ file excel vào hệ thống quản lý mà không cần nhập bằng tay |
| 4	| Tự động gửi thông báo lương qua email	| Gửi thông tin lương cho CB-GV tự động, nhanh chóng, tiện lợi, tránh thiếu hoặc sai xót |
| 5	| Xây dựng chức năng phản hồi lương	| Phản hồi trực tiếp và nhanh chóng các xai sót |
| 6	| Xây dựng chức năng thông báo điểu chỉnh thu nhập |	CB-GV nắm rõ được sự thay đổi thông tin lương và tăng tính minh bạch |
| 7	| Thống kê lương |	Phân tích và thống kê được lương theo tháng/năm hoặc khoảng thời gian tùy chọn |
## IV. Hình ảnh Demo
### 1. Chức năng của Cán bộ - Giảng viên
#### a. Trang chủ
Trang chủ khi Cán bộ - Giảng viên truy cập vào tài khoản, giao diện hiển thị thông tin tháng lương và bài đăng thông báo mới nhất
| ![image](https://user-images.githubusercontent.com/15710296/194470300-14652e9b-cf01-474f-ab6c-cc3e3c862214.png) |
|:-:|
| *Trang chủ* |
#### b. Xem và phản hồi lương
Xem chi tiết khoản lương trong một tháng
| <img src="https://user-images.githubusercontent.com/15710296/194470459-dcf0e652-500f-4cbd-8abd-d2f64d0b7c5d.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194470512-8a6677c5-6eec-40e6-bc37-b5d365d9f7e4.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194470549-6d1e7c94-6e9d-403a-95b3-e7e5b1b96e4a.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194470562-64c5fa88-03fa-4136-9aac-55a08cebaf07.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194470579-10f77ea3-9769-416b-be56-bc6cd94bbc4b.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194470592-11481265-896c-4aae-9176-cc86c659517a.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194470602-809a7a4f-f508-48e0-8dc2-babbf7649394.png" width="50%" /> |
|:-:|
| *Xem và phản hồi lương* |
### 2. Chức năng của quản trị viên
#### a. Quản lý lương
Quản lý thông tin lương các tháng của Cán bộ - Giảng viên
| <img src="https://user-images.githubusercontent.com/15710296/194471187-2ea3fb70-40bb-4b75-8d9b-abe49369ab40.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471201-701fac25-6696-413a-bc5d-67a6178e747c.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471214-f5e47ced-751f-4327-ab51-a9d2f40b320a.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471225-9358fe27-ca12-488c-a1a8-852eb21fad48.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471231-84ede23b-f04c-407e-b5a4-f1fd2a2e38d7.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471243-e25efed8-6d7f-4fb3-a8fe-e0d2b0ac5170.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471248-e7ea5c6a-6f13-4078-a366-0ccc7bdc911b.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471262-8fc2bf44-1369-4ab9-9e43-c7465da925cf.png" width="50%" /> |
|:-:|
| *Giao diện quản lý lương* |
#### b. Nhập lương
Nhập thông tin lương từ file Excel nhanh chóng
| <img src="https://user-images.githubusercontent.com/15710296/194471330-9d4e087a-45ec-4260-9c57-05e31fb0cf03.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471344-295f9748-5ff0-4050-98cf-3204cceaee9e.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471358-754170eb-b027-4029-9248-766244d7f57b.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471391-8cb9dfbe-eef7-4871-afcb-76e45c7078c1.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471398-96105d6b-93c7-4457-b3b6-3005b92fa080.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471432-aab28404-1704-4e6f-93c2-f3061836b6e5.png" width="50%" /> |
|:-:|
| *Giao diện nhập lương* |
#### c. Quản lý bài đăng thông báo
Quản lý các bài đăng thông báo
| <img src="https://user-images.githubusercontent.com/15710296/194471446-ab92666d-658a-4761-ada8-bcbb6aaf8471.png" width="50%" /><img src="https://user-images.githubusercontent.com/15710296/194471453-5fd62d7f-3c62-4c31-b1a0-00f1c9114425.png" width="50%" /> |
|:--:|
| *Giao diện quản lý bài đăng thông báo* |
#
Để xem đầy đủ báo cáo phần mềm vui lòng truy cập file [BaoCao_SalaryManagement.pdf](https://github.com/jennydo2000/salary-management/blob/master/BaoCao_SalaryManagement.pdf)
