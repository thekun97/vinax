---
title: Chiến lược chunking
description: A guide in my new Starlight docs site.
---

Trong hệ thống Retrieval-Augmented Generation (RAG), chunking đóng vai trò trọng yếu ở giai đoạn tiền xử lý (ingestion), giúp chia nhỏ văn bản hoặc tài liệu dài thành các đoạn (“chunks”) nhỏ hơn để dễ dàng xử lý và truy xuất thông tin. Mỗi chunk được mã hoá thành véc-tơ nhúng (embedding vector) và lưu trữ trong cơ sở dữ liệu véc-tơ, phục vụ cho giai đoạn truy vấn (retrieval). Cỡ chunk càng nhỏ, càng tăng khả năng khớp chính xác với truy vấn của người dùng, tuy nhiên nếu quá nhỏ sẽ tốn nhiều tài nguyên và có thể thiếu ngữ cảnh; nếu quá lớn thì có nguy cơ chứa nhiều thông tin thừa, giảm độ chính xác tìm kiếm. Do đó, chiến lược chunking phải cân bằng giữa độ đầy đủ thông tin và hiệu suất truy hồi. Nhìn chung, chunking giúp RAG cải thiện hiệu quả truy vấn nhờ cung cấp ngữ cảnh cụ thể, song cũng gây ra chi phí tính toán gia tăng và yêu cầu tinh chỉnh thông số để đạt hiệu quả tối ưu. 

![Alt text](https://miro.medium.com/v2/resize:fit:720/format:webp/0*iyB6L4QrcSSF7o2x.png)

## Các phương pháp chunking phổ biến

Dưới đây là các phương pháp chunking phổ biến hiện nay được sắp xếp từ lúc cũ tới mới nhất. Các phương pháp mới nhất gần đây phù hợp cho nhiều dạng dữ liệu phức tạp hơn.

🔽 Có sẵn code mẫu của từng phương pháp ngay bên dưới bằng Google Colab — dành cho ai muốn đọc code trước. 😄

💡 Nhưng nếu nắm vững của từng phương pháp, sẽ dễ dàng chọn ra phương pháp tối ưu nhất cho kiểu dữ liệu của mình.

### Fixed-size chunking

Đơn giản nhất, cách này cắt văn bản thành các đoạn có độ dài cố định, có thể có hoặc không có lặp chồng lên nhau. Ưu điểm là dễ cài đặt, nhanh và không cần thư viện NLP phức tạp. Nhược điểm là có thể cắt ngang câu hoặc chủ đề, khiến thông tin bị gián đoạn và tốn kém bộ nhớ hơn khi có trùng lặp.

### Semantic chunking

Chia đoạn dựa trên ý nghĩa hoặc chủ đề ngữ nghĩa. Phương pháp này nhóm các câu nói về cùng một chủ đề thành cùng một chunk.

### Sliding window chunking

### Recursive (hierarchical) chunking
