---
title: Tối ưu hoá LLMs
description: Tối ưu hoá LLMs
---

Mô hình ngôn ngữ lớn (Large Language Models – LLM) như GPT-4, Llama 3, hay các biến thể tương tự được huấn luyện trên lượng dữ liệu khổng lồ để hiểu và sinh ngôn ngữ. Tuy nhiên, những mô hình này có giới hạn: sau khi huấn luyện, kiến thức của chúng cố định ở một mốc thời gian nhất định (cutoff) và không được cập nhật tự động khi thông tin mới xuất hiện. Điều này dẫn đến việc khi LLM được hỏi về sự kiện gần đây hoặc thông tin chuyên sâu (chưa có trong dữ liệu huấn luyện), chúng có thể đưa ra câu trả lời sai lệch hoặc "hallucination" (bịa đặt thông tin). Ngoài ra, LLM thường không biết thông tin nội bộ, dữ liệu chuyên ngành hoặc cập nhật đặc thù của doanh nghiệp, vốn quan trọng trong nhiều ứng dụng thực tế. Do đó, cần có những phương pháp tối ưu hóa và tùy biến LLM để cải thiện độ chính xác và hiệu quả trên các tác vụ thực tế.

Trong việc tối ưu hóa các LLM phù hợp với một lĩnh vực cá nhân hoặc doanh nghiệp cụ thể, trong tài liệu này sẽ giới thiệu hai phương pháp được áp dụng để giảm hiện tượng ảo giác phổ biến nhất hiện nay là:

* RAG - Retrieval-Augmented Generation (Sinh ngôn ngữ có tăng cường truy xuất)

* Fine-tuning (tinh chỉnh mô hình)

Hai phương pháp này phục vụ những mục đích khác nhau và được lựa chọn tùy theo yêu cầu của bài toán. Chi tiết về hai phương pháp này, cách thức kỹ thuật, ưu nhược điểm và từng trường hợp sử dụng, sẽ được trình bày chi tiết trong các phần sau.

Đầu tiên việc lựa chọn phương pháp thực sự rất quan trọng, vì nếu đưa ra lựa chọn sai, bạn có thể tốn kém thời gian và chi phí với một mô hình kém hiệu quả. Khi cân nhắc giữa RAG và Fine‑tuning, bạn cần hiểu rõ ưu – nhược điểm của từng phương pháp:

## RAG

#### Điểm mạnh
- Cập nhật thời gian thực: RAG cho phép LLM truy cập dữ liệu mới nhất (sự kiện gần đây, thông tin chuyên ngành) mà mô hình gốc không biết.
- Tăng độ tin cậy: Kết quả tạo ra có thể đi kèm nguồn tham khảo, giúp người dùng kiểm chứng thông tin. Người phát triển cũng kiểm soát được nguồn dữ liệu sử dụng (có thể áp dụng kiểm duyệt, phân quyền), đảm bảo an toàn và tuân thủ quy định.
- Chi phí hiệu quả: So với việc huấn luyện lại một LLM mới hoặc tinh chỉnh toàn bộ mô hình, RAG tận dụng LLM hiện có và chỉ tập trung xây dựng hệ thống truy xuất dữ liệu.

#### Hạn chế
- Phụ thuộc chất lượng dữ liệu: Hiệu quả của RAG hoàn toàn dựa vào kho tri thức bên ngoài. Nếu dữ liệu bị lỗi thời, không đầy đủ hoặc không phù hợp, câu trả lời cũng có thể kém chính xác.
- Chi phí runtime: Phải duy trì và truy vấn cơ sở dữ liệu vector, đôi khi gây trễ, cần thiết lập hệ thống truy xuất, quản lý vector, đảm bảo tích hợp chặt chẽ.

#### Khi nào nên sử dụng RAG
- Cần thông tin cập nhật, kiến thức thay đổi liên tục: tin tức, chính sách, tài liệu tài chính, y tế…
- Vẫn muốn giữ model gốc: tránh hiện tượng mất dần năng lực ("catastrophic forgetting").
- Nguồn lực hạn chế để train lại - nhanh, rẻ, tốt cho bài toán hỏi đáp dựa trên các dữ liệu có sẵn chính xác (hỗ trợ khách hàng, hệ thống hỏi đáp nội bộ, ứng dụng y tế, pháp lý).

## Fine-tuning

#### Điểm mạnh
- Tùy biến mạnh mẽ: Mô hình sau tinh chỉnh có thể sinh câu trả lời với phong cách, định dạng hoặc nội dung phù hợp với ứng dụng.
- Hiệu quả trên domain chuyên sâu: Khi nhiệm vụ rõ ràng và dữ liệu huấn luyện chuyên ngành, fine-tuning giúp mô hình hiểu sâu kiến thức đặc thù.
- Phản hồi nhanh: Một khi mô hình đã tinh chỉnh xong, khi inference (sinh câu trả lời) nó chỉ cần sử dụng prompt đầu vào mà không cần thêm bước truy vấn bên ngoài. Nhờ vậy, độ trễ trả lời thấp hơn so với RAG (không phải thực hiện truy xuất thêm dữ liệu).

#### Hạn chế
- Chi phí cao: Yêu cầu nhiều dữ liệu huấn luyện gắn nhãn chất lượng và phần cứng tính toán mạnh (GPU/TPU).
- Quên kiến thức chung: Trong quá trình tinh chỉnh, mô hình có thể bị “quên” dần kiến thức ban đầu về ngôn ngữ chung (catastrophic forgetting), dẫn đến giảm khả năng xử lý ngữ liệu ngoài phạm vi đã học.
- Kiến thức tĩnh: Sau khi tinh chỉnh, kiến thức của mô hình không cập nhật trừ khi huấn luyện lại. Nếu có thông tin mới, bắt buộc phải tiến hành fine-tuning bổ sung, khiến mô hình dễ trở nên lỗi thời nếu không được duy trì thường xuyên, để xây dựng một quy trình học tự động sẽ được giới thiệu trong mục MLOps.

#### Khi nào nên sử dụng Fine-tuning

- Nhận dạng thực thể chuyên ngành: Khi cần mô hình nắm vững thuật ngữ đặc thù (y khoa, pháp luật, tài chính), tinh chỉnh trên bộ dữ liệu chuyên ngành giúp nâng cao độ chính xác nhận dạng.
- Cá nhân hóa hoặc đặc thù người dùng: Nếu ứng dụng cần hiểu rõ sở thích hoặc nhu cầu cá nhân, fine-tuning giúp LLM học từ dữ liệu người dùng cụ thể.
- Khi khai thác tối đa kĩ thuật RAG không đạt được kết quả như mong đợi, cần phải kết hợp thêm fine-tuning lại mô hình.

<br>
<br>
<br>

![Alt text](https://media.springernature.com/lw685/springer-static/image/chp%3A10.1007%2F979-8-8688-0890-6_6/MediaObjects/633000_1_En_6_Fig10_HTML.jpg)
