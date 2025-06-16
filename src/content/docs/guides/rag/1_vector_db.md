---
title: Cơ sở dữ liệu vector
description: Cơ sở dữ liệu vector
---

Cơ sở dữ liệu vectơ (Vector database) là hệ thống chuyên biệt dùng để lưu trữ và truy vấn các vector embeddings (biểu diễn dữ liệu dạng vectơ) nhằm hỗ trợ tìm kiếm tương tự ngữ nghĩa nhanh chóng. Thay vì lưu trữ dữ liệu dạng cột – hàng như cơ sở dữ liệu truyền thống, vector DB lưu thông tin dưới dạng các vectơ nhiều chiều (được sinh ra từ các mô hình học sâu) kèm theo metadata. Điều này cho phép chúng thực hiện các phép so sánh tương đồng (similarity search) giữa các vectơ một cách hiệu quả, từ đó truy xuất dữ liệu liên quan đến truy vấn theo ngữ nghĩa. Trong kiến trúc RAG, vector DB chịu trách nhiệm lưu trữ và tìm kiếm các vectơ biểu diễn thông tin (chẳng hạn đoạn văn bản hoặc bản ghi dữ liệu) để cung cấp cho mô hình sinh (LLM) thông tin tham chiếu phù hợp.

<br>

![Alt text](https://qdrant.tech/articles_data/what-is-a-vector-database/vector-db-structure.png)

<br>

Cấu trúc dữ liệu trong một Vector Database bao gồm ID, vector embedding, và payload metadata. Vector DB lưu mỗi điểm dữ liệu dưới dạng một vectơ kèm ID và payload (metadata). Trong đó payload có thể là các trường bổ sung như tags, ngày tháng, nhãn loại… dùng để lọc/xếp hạng kết quả.

Để phục vụ truy vấn theo ngữ nghĩa, dữ liệu cần được chuyển thành embeddings trước khi lưu. Cụ thể, các đoạn văn bản, hình ảnh, hay dữ liệu phi cấu trúc khác sẽ được đưa vào mô hình nhúng (embedding model) để chuyển đổi thành vectơ số. Những vectơ này sau đó được đánh chỉ mục (indexing) và lưu trữ trong vector DB.

Vector DB thường sử dụng các thuật toán Tìm kiếm lân cận gần đúng (Approximate Nearest Neighbor – ANN) để tìm nhanh các vectơ tương tự. Thay vì so sánh lần lượt tất cả vectơ trong cơ sở (độ phức tạp O(n)), các thuật toán ANN như HNSW (Hierarchical Navigable Small World), IVF+PQ, LSH, v.v. sẽ xây dựng cấu trúc chỉ mục đặc biệt để thu hẹp phạm vi tìm kiếm. Ví dụ, tại bước lập chỉ mục, một DB có thể áp dụng các thuật toán như PQ (Product Quantization), LSH hoặc HNSW để biến đổi vectơ và tổ chức chúng thành cấu trúc dữ liệu cho phép tìm kiếm nhanh hơn. Khi truy vấn, vector DB so sánh vectơ truy vấn đã được nhúng với chỉ mục đã tạo, tìm ra những vectơ gần nhất (theo metric đã chọn).

## Phương pháp đo độ tương đồng (Similarity Metrics)

Những phép đo phổ biến bao gồm:

- Cosine Similarity (độ tương đồng Cosine): đánh giá góc giữa hai vectơ, chú trọng hướng hơn độ lớn; thường được chuyển thành khoảng cách cosine (giá trị 0–2). Thích hợp với văn bản và dữ liệu khi quan tâm đến ngữ nghĩa nhiều hơn magnitude
- Dot Product (tích vô hướng): đánh giá sự tương đồng bằng tích vô hướng. Thường dùng trong khuyến nghị hoặc khi vectơ chưa chuẩn hoá. Phép tính này phản ánh “độ đồng thuận” giữa hai vectơ; vectơ càng song song thì tích càng lớn. Độ lớn phép đo này có thể từ -∞ đến +∞, và thường được dùng kèm với việc chuẩn hoá siêu vector để biến thành khoảng cách
- Euclidean Distance (khoảng cách L2): khoảng cách trực tiếp giữa hai điểm trong không gian; thích hợp nếu mong muốn khoảng cách thực tế của vectơ (ví dụ dữ liệu không gian, embedding đã tính khoảng cách). Độ lớn từ 0 trở lên, càng gần 0 càng giống nhau.

## Các hệ quản trị cơ sở dữ liệu vectơ phổ biến

Dưới đây là tổng quan một số hệ vector database phổ biến (đến 2025), cùng so sánh theo các tiêu chí như hiệu năng, khả năng mở rộng, kiểu triển khai, và tính năng đặc biệt như hỗ trợ hybrid search hay lọc metadata.

- Pinecone: là dịch vụ vector DB đám mây quản lý hoàn toàn (fully managed SaaS). Được thiết kế cho dữ liệu kích thước cao lớn, Pinecone tối ưu hoá cho tìm kiếm độ trễ thấp và quy mô lớn. Nó hỗ trợ xử lý real-time ingestion, tự động phân mảnh (sharding) và có kiến trúc serverless để tách biệt lưu trữ/và tính toán nhằm tối ưu chi phí. Pinecone cho phép lọc theo metadata khi tìm kiếm (với ngôn ngữ truy vấn tương tự MongoDB), và có thể thực hiện hybrid search bằng cách dùng kết hợp chỉ mục vectơ (dense) và chỉ mục từ khóa (sparse) như hướng dẫn trong tài liệu của họ. Phù hợp cho các ứng dụng doanh nghiệp cần quy mô lớn, hiệu năng cao, và tích hợp sẵn với hệ sinh thái như LangChain, LlamaIndex

- Weaviate: là vector DB mã nguồn mở (open-source), có thể tự triển khai hoặc dùng dịch vụ cloud. Weaviate hỗ trợ lưu trữ đối tượng kết hợp vectơ, cho phép scale ngang sang hàng trăm hoặc hàng tỷ đối tượng với tính năng nhân bản (replication) và bảo mật cao. Đặc điểm nổi bật của Weaviate là hỗ trợ hybrid search tích hợp sẵn: nó kết hợp tìm kiếm vectơ với tìm kiếm truyền thống theo từ khoá (BM25) trong cùng một truy vấn và kết hợp điểm số dựa trên trọng số tuỳ chỉnh. Weaviate cũng cung cấp giao diện truy vấn GraphQL, và hệ thống module cho phép mở rộng chức năng (ví dụ module text2vec-transformers để tự động hóa nhúng từ khóa qua BERT, module hình ảnh img2vec-neural, v.v.). Weaviate phù hợp cho các trường hợp cần truy vấn đa phương thức, kết hợp tìm kiếm ngữ nghĩa và các điều kiện lọc, nhất là khi đã quen với GraphQL API.

- FAISS: không phải một cơ sở dữ liệu độc lập, mà là thư viện mã nguồn mở (C++/Python) do Meta phát triển chuyên cho tìm kiếm tương đồng vectơ. FAISS cung cấp nhiều loại chỉ mục (như flat, IVF, HNSW, PQ, v.v.) và cho phép xử lý rất nhanh với hàng chục tỷ vectơ (hỗ trợ cả CPU và GPU). Tuy nhiên, FAISS chỉ là công cụ tìm kiếm trên vectơ, không bao gồm tính năng quản lý dữ liệu (chẳng hạn CRUD, nhân bản, backup, truy vấn metadata) của một DB đầy đủ. Do đó FAISS thường được tích hợp vào hệ thống lớn hơn, hoặc dùng cho môi trường nghiên cứu và prototype.
ChromaDB: là một vector DB mã nguồn mở bằng Python hướng tới ứng dụng LLM. ChromaDB thiết kế cho phát triển ứng dụng nhỏ/vừa: có thể chạy trong notebook hay cluster, hỗ trợ lưu dữ liệu lên nhiều backend (Ví dụ PostgreSQL, RocksDB). Nó dùng chỉ mục HNSW lưu trong RAM theo mặc định. Điểm mạnh là dễ sử dụng và tích hợp tốt với các framework LLM (chạy qua Python API, tích hợp LangChain, LlamaIndex). Tuy nhiên, Chroma không phải hệ thống phân tán lớn, quy mô thích hợp từ hàng nghìn đến vài triệu điểm dữ liệu. Nó hỗ trợ lọc dựa trên metadata ở mức cơ bản (qua trường dữ liệu) nhưng chưa có hỗ trợ hybrid search tích hợp phức tạp như Weaviate/Qdrant.

- Milvus: là vector DB mã nguồn mở phát triển bởi Zilliz, nổi bật ở khả năng mở rộng và hiệu năng cao. Milvus có cả chế độ standalone (một máy) và distributed (cluster) để xử lý từ vài triệu đến hàng chục tỷ vectơ. Nó tối ưu cho tìm kiếm tương đồng độ trễ thấp, hỗ trợ cả CPU và GPU. Milvus cũng tích hợp tốt với các framework ML (TensorFlow, PyTorch, Hugging Face) và có nhiều chế độ triển khai (Docker, Kubernetes, v.v.). Tính năng Milvus cung cấp rất phong phú: hỗ trợ lọc metadata và hybrid search với nhiều trường vectơ khác nhau, thậm chí từ phiên bản 2.5 tích hợp cả tìm kiếm văn bản (full-text) và nhiều cải tiến về hiệu suất. Milvus phù hợp cho ứng dụng quy mô lớn như khuyến nghị, tìm kiếm hình ảnh/video, hoặc RAG ở quy mô doanh nghiệp.

- Qdrant: là vector DB mã nguồn mở viết bằng Rust, cũng có dịch vụ đám mây (Qdrant Cloud). Qdrant thiết kế “cloud-native” để dễ dàng scale ngang, tương thích với container/Kubernetes. Nó sử dụng thuật toán HNSW tùy chỉnh để tìm kiếm nhanh trên hàng tỷ vectơ, và lưu trữ tối ưu cả trong RAM lẫn trên đĩa (tùy chọn memmap) để xử lý dataset lớn . Qdrant nổi bật ở khả năng lọc truy vấn nâng cao: bạn có thể áp các điều kiện trên payload (metadata) như chuỗi, số, phạm vi địa lý trong cùng truy vấn vector . Ngoài ra, nó hỗ trợ đa ngôn ngữ thông qua OpenAPI v3 và nhiều thư viện SDK khác nhau (Python, Go, JS, v.v.). Vì viết bằng Rust, Qdrant rất tiết kiệm tài nguyên, đồng thời có thiết kế đa tenant giúp cô lập dữ liệu cho từng người dùng.

- Elasticsearch (v8 với vector plugin): Elasticsearch bản thân là hệ thống tìm kiếm văn bản phân tán, nhưng từ phiên bản 8 đã tích hợp tính năng tìm kiếm vectơ qua trường dense_vector. Elasticsearch sử dụng thuật toán HNSW bên trong Lucene để hỗ trợ ANN và đã liên tục cải tiến hiệu năng trên các phiên bản 8.x. Kể từ ES 8.2, nó cho phép lọc (filter) trực tiếp trên kết quả kNN; từ 8.4 hỗ trợ truy vấn kết hợp vector với keyword (hybrid search). Elasticsearch phù hợp khi đã có sẵn hạ tầng Elastic, cần thêm khả năng tìm kiếm ngữ nghĩa mà vẫn tận dụng hệ thống phân tích text và khả năng đa trường (filtering, aggregations) mạnh mẽ. Tuy nhiên, ES là một giải pháp nặng (chạy JVM, cần tuning) nên chi phí tài nguyên có thể cao hơn các DB chuyên biệt.

## Bảng so sánh tổng quan các hệ cơ sở dữ liệu vectơ

| Công cụ           | Triển khai (Cloud/OSS)              | Khả năng mở rộng & hiệu năng                                              | Tính năng nổi bật                                                                                    |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Pinecone**      | Managed SaaS (cloud)                | Kiến trúc serverless, mở rộng ngang (hàng tỷ vectơ), tìm kiếm độ trễ thấp | Hỗ trợ lọc theo metadata (cú pháp tương tự MongoDB), tìm kiếm hybrid qua nhiều chỉ mục               |
| **Weaviate**      | Mã nguồn mở (self-host)/Cloud       | Mở rộng ngang (hàng triệu–tỷ vectơ), tìm kiếm trong tích tắc              | Hỗ trợ hybrid search (kết hợp BM25 + vector), API GraphQL, module nhúng tích hợp (text2vec, img2vec) |
| **FAISS**         | Thư viện OSS (C++/Python)           | Cực nhanh, hỗ trợ GPU, xử lý hàng chục tỷ vectơ                           | Chỉ là thư viện tìm kiếm vectơ (không có cơ sở dữ liệu), không hỗ trợ lọc metadata                   |
| **ChromaDB**      | Mã nguồn mở (Python)                | Thiết kế cho quy mô nhỏ-vừa, dùng HNSW trong RAM                          | Dễ dùng cho ứng dụng LLM (tích hợp LangChain, LlamaIndex), API đơn giản                              |
| **Milvus**        | Mã nguồn mở (self-host)/Cloud       | Hỗ trợ cả standalone và cluster (tens of billions), tối ưu hiệu năng cao  | Hỗ trợ metadata filtering và hybrid search, tích hợp các framework ML, triển khai trên K8s/Docker    |
| **Qdrant**        | Mã nguồn mở (self-host)/Cloud       | Cloud-native, mở rộng ngang dễ dàng (horizontal), HNSW tùy chỉnh nhanh    | Lọc nâng cao theo payload (metadata), hỗ trợ chuỗi, số, địa lý, viết bằng Rust cho hiệu năng cao     |
| **Elasticsearch** | Mã nguồn mở/Managed (Elastic Cloud) | Cluster phân tán, tích hợp HNSW ANN (v8.x), tối ưu SIMD/multi-thread      | Tìm kiếm kết hợp văn bản + vectơ (hybrid), bộ lọc và agg phong phú, hỗ trợ nhiều trường dữ liệu      |


## Lựa chọn công cụ theo trường hợp sử dụng

- Quy mô nhỏ/tăng tốc phát triển: Nếu dự án vừa hoặc mới thử nghiệm, các giải pháp mã nguồn mở như ChromaDB, FAISS hay Weaviate là lựa chọn hợp lý. Chúng dễ triển khai, có tích hợp sẵn với môi trường Python và các thư viện LLM. FAISS thích hợp cho môi trường nghiên cứu/trình diễn vì chỉ là thư viện, còn Chroma có API thân thiện cho notebook. Weaviate cũng có thể dùng nhỏ với cấu hình ít nút.

- Quy mô doanh nghiệp/production: Các hệ quản lý (managed) như Pinecone hoặc dịch vụ như Milvus cloud, Qdrant Cloud thích hợp khi dữ liệu rất lớn và cần khả năng mở rộng linh hoạt. Pinecone đặc biệt tốt về hiệu năng thấp-latency và hoạt động serverless. Milvus và Qdrant là lựa chọn tốt nếu muốn tự quản lý hoặc cần chức năng lọc/hybrid nâng cao.
Yêu cầu tìm kiếm kết hợp/hybrid + lọc metadata: Nếu cần vừa tìm kiếm ngữ nghĩa vừa áp dụng điều kiện lọc phức tạp, nên chọn Weaviate hoặc Qdrant. Weaviate hỗ trợ hybrid tích hợp (BM25+vector) và cho phép lọc dữ liệu qua GraphQL; Qdrant cung cấp bộ lọc metadata rất phong phú và hiệu quả khi chạy trên đám mây. Cả hai đều dễ dàng mở rộng và phù hợp RAG khi kết hợp lấy thêm tri thức từ tập dữ liệu lớn.

- Kết hợp với hệ thống hiện có: Nếu bạn đã dùng ElasticSearch cho tìm kiếm thông thường, việc bật tính năng dense_vector trong ES là cách tiện lợi để bổ sung chức năng tìm kiếm vectơ. Tương tự, các extension như pgvector cho PostgreSQL (nếu cần lưu trữ vectơ trong DB quan hệ) cũng có thể xem xét trong môi trường SQL.

