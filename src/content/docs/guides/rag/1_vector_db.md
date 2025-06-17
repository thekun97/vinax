---
title: Cơ sở dữ liệu vector
description: Cơ sở dữ liệu vector
---

Cơ sở dữ liệu vectơ (Vector database) là hệ thống chuyên biệt dùng để lưu trữ và truy vấn các biểu diễn dữ liệu dạng vectơ (vector embeddings) nhằm hỗ trợ tìm kiếm tương tự ngữ nghĩa. Thay vì lưu trữ dữ liệu dạng cột – hàng như cơ sở dữ liệu truyền thống, vector DB lưu thông tin dưới dạng các vectơ nhiều chiều (được sinh ra từ các mô hình học sâu) kèm theo metadata. Trong kiến trúc RAG, vector DB chịu trách nhiệm lưu trữ và tìm kiếm các vectơ biểu diễn thông tin để cung cấp cho mô hình sinh (LLM) thông tin kiến thức bổ trợ phù hợp.

<br>

![Alt text](https://qdrant.tech/articles_data/what-is-a-vector-database/vector-db-structure.png)

<br>

Cấu trúc dữ liệu trong một Vector Database bao gồm ID, dữ liệu vectơ, và dữ liệu metadata. Với metadata có thể là các trường bổ sung như tags, ngày tháng, nhãn loại… dùng để lọc/xếp hạng kết quả.

Để phục vụ truy vấn theo ngữ nghĩa, dữ liệu cần được chuyển thành vectơ trước khi lưu. Cụ thể, các đoạn văn bản, hình ảnh, hay dữ liệu phi cấu trúc khác sẽ được đưa vào mô hình nhúng (embedding model) để chuyển đổi thành vectơ số. Những vectơ này sau đó được đánh chỉ mục (indexing) và lưu trữ trong vector DB.

Vector DB thường sử dụng các thuật toán Tìm kiếm lân cận gần đúng (Approximate Nearest Neighbor – ANN) để tìm nhanh các vectơ tương tự. Thay vì so sánh lần lượt tất cả vectơ trong cơ sở (độ phức tạp thuật toán là O(n)), các thuật toán ANN như HNSW (Hierarchical Navigable Small World), IVF+PQ, LSH,... sẽ xây dựng cấu trúc chỉ mục đặc biệt để thu hẹp phạm vi tìm kiếm. Khi truy vấn, vector DB so sánh vectơ truy vấn đã được nhúng với chỉ mục đã tạo, tìm ra những vectơ gần nhất.

## Phương pháp đo độ tương đồng (Similarity Metrics)

Những phép đo phổ biến bao gồm:

- Độ tương đồng Cosine (Cosine Similarity): đánh giá góc giữa hai vectơ, chú trọng hướng của vectơ hơn là độ dài. Thích hợp với văn bản và dữ liệu khi quan tâm đến ngữ nghĩa nhiều hơn độ lớn, trong thị giác máy tính hình ảnh được biểu diễn thành embedding rồi dùng cosine để xác định độ tương tự.

- Tích vô hướng (Dot Product): đánh giá sự tương đồng bằng tích vô hướng. Tích vô hướng sẽ dương nếu góc giữa hai vector nhỏ hơn 90 độ, âm nếu góc lớn hơn 90 độ, và bằng 0 nếu hai vector vuông góc với nhau. Tích vô hướng bị ảnh hưởng bởi cả độ dài và hướng của các vector. Sẽ thường xuyên gặp các mô hình ngôn ngữ lớn (LLM) sử dụng tích vô hướng trong quá trình huấn luyện. Thường dùng trong hệ thống gợi ý quan tâm tới cả ngữ nghĩa và độ lớn vectơ hoặc khi vectơ chưa được chuẩn hoá.

- Khoảng cách L2 (Euclidean Distance): phản ánh đúng khoảng cách giữa từng giá trị trong các vector được so sánh; nếu khoảng cách Euclidean rất nhỏ, thì các giá trị tại từng tọa độ trong các vector cũng rất gần nhau. Thích hợp cho các bài toán phân cụm, các hệ thống gợi ý có chứa thông tin số lượng.

<br>

![Alt text](https://pbs.twimg.com/media/GDTlkNqWsAA65BZ?format=jpg&name=small)

## Các hệ quản trị cơ sở dữ liệu vectơ phổ biến

Dưới đây là một số cơ sở dữ liệu vectơ phổ biến (đến 2025), cùng so sánh theo các tiêu chí như hiệu năng, khả năng mở rộng, cách triển khai, và các tính năng riêng biệt.

- Pinecone: là dịch vụ vector database đám mây quản lý hoàn toàn (fully managed). Pinecone tối ưu hoá cho tìm kiếm dữ liệu kích thước lớn với độ trễ thấp và quy mô lớn. Hỗ trợ xử lý real-time ingestion, tự động phân mảnh (sharding) và có kiến trúc serverless để tách biệt lưu trữ/và tính toán nhằm tối ưu chi phí. Pinecone cho phép lọc theo metadata khi tìm kiếm, và có thể thực hiện hybrid search bằng cách dùng kết hợp chỉ mục vectơ (dense) và chỉ mục từ khóa (sparse). Phù hợp cho các ứng dụng doanh nghiệp cần quy mô lớn, hiệu năng cao, và tích hợp sẵn với hệ sinh thái như LangChain, LlamaIndex.

- Weaviate: là vector DB mã nguồn mở (open-source), có thể tự triển khai hoặc dùng dịch vụ cloud. Đặc điểm nổi bật của Weaviate là hỗ trợ hybrid search tích hợp sẵn: kết hợp tìm kiếm vectơ với tìm kiếm truyền thống theo từ khoá (BM25) trong cùng một truy vấn và kết hợp điểm số dựa trên trọng số tuỳ chỉnh. Weaviate cũng cung cấp giao diện truy vấn GraphQL, và hệ thống module cho phép mở rộng chức năng (ví dụ module text2vec-transformers để tự động hóa nhúng từ khóa qua BERT, module hình ảnh img2vec-neural,...). Weaviate phù hợp cho các trường hợp cần truy vấn đa phương thức, kết hợp tìm kiếm ngữ nghĩa và các điều kiện lọc, nhất là khi đã quen với GraphQL API.

- Milvus: là vector DB mã nguồn mở phát triển bởi Zilliz, nổi bật ở khả năng mở rộng và hiệu năng cao. Milvus có cả chế độ standalone (một máy) và distributed (cluster) để xử lý lượng vectơ khổng lồ. Hỗ trợ cả CPU và GPU. Milvus cũng tích hợp tốt với các framework ML (TensorFlow, PyTorch, Hugging Face) và có nhiều chế độ triển khai (Docker, Kubernetes,...). Hỗ trợ đa dạng lọc metadata và hybrid search với nhiều trường vectơ khác nhau. Milvus phù hợp cho ứng dụng quy mô lớn như khuyến nghị, tìm kiếm hình ảnh/video, hoặc RAG ở quy mô doanh nghiệp lớn.

- Qdrant: là vector DB mã nguồn mở viết bằng Rust, cũng có dịch vụ đám mây (Qdrant Cloud). Qdrant thiết kế “cloud-native” để dễ dàng scale ngang, tương thích với container/Kubernetes. Nó sử dụng thuật toán HNSW tùy chỉnh để tìm kiếm nhanh. Qdrant nổi bật ở khả năng lọc truy vấn ở nhiều kiểu dữ liệu phức tạp với các điều kiện như chuỗi, số, phạm vi địa lý. Ngoài ra, nó hỗ trợ đa ngôn ngữ thông qua nhiều thư viện SDK khác nhau (Python, Go, JS, v.v.). Vì viết bằng Rust, Qdrant rất tiết kiệm tài nguyên.

Hiện nay, bên cạnh các cơ sở dữ liệu vectơ chuyên dụng, PostgreSQL (với tiện ích mở rộng pgvector) và Elasticsearch (phiên bản 8 trở lên với vector plugin) đã tích hợp sẵn khả năng lưu trữ và tìm kiếm dữ liệu vectơ. Việc này cho phép tận dụng hạ tầng hiện có để thực hiện tìm kiếm tương tự — sử dụng cú pháp SQL quen thuộc trong PostgreSQL hoặc DSL trong Elasticsearch.

Đối với các hệ thống đã triển khai PostgreSQL hoặc Elasticsearch, đây là một giải pháp linh hoạt và thuận tiện để bổ sung tìm kiếm vectơ mà không cần thêm dịch vụ mới. Tuy nhiên, do đặc thù dữ liệu vectơ thường có kích thước lớn và yêu cầu hiệu năng cao khi tìm kiếm, việc triển khai đòi hỏi hiểu biết kỹ thuật sâu và tối ưu tốt. Nếu không được thiết kế cẩn thận, chi phí tài nguyên có thể vượt quá so với việc sử dụng các hệ cơ sở dữ liệu vectơ chuyên biệt.

## Bảng so sánh tổng quan các hệ cơ sở dữ liệu vectơ

| Công cụ           | Triển khai (Cloud/OSS)              | Khả năng mở rộng & hiệu năng                                              | Tính năng nổi bật                                                                                    |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Pinecone**      | Managed Cloud               | Kiến trúc serverless, mở rộng tốt, tìm kiếm độ trễ thấp | Hỗ trợ lọc theo metadata (cú pháp tương tự MongoDB), tìm kiếm hybrid qua nhiều chỉ mục               |
| **Weaviate**      | Mã nguồn mở (self-host)/Cloud       | Mở rộng tốt, tìm kiếm nhanh              | Hỗ trợ hybrid search (kết hợp BM25), API GraphQL, module nhúng tích hợp (text2vec, img2vec) |
| **Milvus**        | Mã nguồn mở (self-host)/Cloud       | Hỗ trợ cluster, tối ưu hiệu năng cao  | Hỗ trợ metadata filtering và hybrid search, tích hợp các framework ML    |
| **Qdrant**        | Mã nguồn mở (self-host)/Cloud       | Cloud-native, mở rộng ngang dễ dàng (horizontal), HNSW tùy chỉnh nhanh    | Lọc nâng cao theo payload (metadata), hỗ trợ chuỗi, số, địa lý, viết bằng Rust cho hiệu năng cao     |

<br>
<br>

![Alt text](https://miro.medium.com/v2/resize:fit:1400/1*VSkugYj5NOCQ8xTPaWnv2w.png)
