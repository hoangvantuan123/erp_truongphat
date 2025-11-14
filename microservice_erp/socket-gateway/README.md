npm install @nestjs/microservices @grpc/grpc-js @grpc/proto-loader

```
/proto
  ├── code_help
  │     ├── code_help_query.proto
  │     ├── code_help_combo_query.proto
  ├── user
  │     ├── user.proto
  ├── order
  │     ├── order.proto
  ├── common
  │     ├── metadata.proto  # Chứa các message chung như MetadataRequest, MetadataResponse
  │     ├── enums.proto      # Chứa các enum chung
  │     ├── types.proto      # Chứa các kiểu dữ liệu dùng chung
/src
  ├── modules
  │     ├── codeHelpQuery
  │     │     ├── controller
  │     │     ├── service
  │     │     ├── codeHelpQuery.module.ts
  │     ├── codeHelpComboQuery
  │     │     ├── controller
  │     │     ├── service
  │     │     ├── codeHelpComboQuery.module.ts
  │     ├── user
  │     │     ├── controller
  │     │     ├── service
  │     │     ├── user.module.ts
  │     ├── order
  │     │     ├── controller
  │     │     ├── service
  │     │     ├── order.module.ts
  ├── app.module.ts
  ├── main.ts
```

```
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5003',
    package: ['codehelpquery', 'codehelpcomboquery', 'user', 'order'], // Load nhiều package
    protoPath: [
      join(__dirname, '..', 'proto', 'code_help', 'code_help_query.proto'),
      join(__dirname, '..', 'proto', 'code_help', 'code_help_combo_query.proto'),
      join(__dirname, '..', 'proto', 'user', 'user.proto'),
      join(__dirname, '..', 'proto', 'order', 'order.proto'),
      join(__dirname, '..', 'proto', 'common', 'metadata.proto'),
    ],
  },
});

```
```
syntax = "proto3";

package codehelpquery;

import "common/metadata.proto"; // Import metadata dùng chung

service CodehelpQueryService {
  rpc sendCodehelpQuery (CodehelpQueryRequest) returns (CodehelpQueryResponse);
}

message CodehelpQueryRequest {
  Metadata metadata = 1;  
  QueryParams query = 2;
}

message QueryParams {
  string workingTag = 1;
  int32 languageSeq = 2;
  string codeHelpSeq = 3;
  int32 companySeq = 4;
  string keyword = 5;
  string param1 = 6;
  string param2 = 7;
  string param3 = 8;
  string param4 = 9;
}

message CodehelpQueryResponse {
  bool status = 1;
  string message = 2;
  string data = 3;
}
```


```

REQUEST_TIMEOUT = 1200000
PORT = 8086

JWT_SECRET= 'P@5sW0rD!$R3c3nT@2024'


HOST_REDIS=localhost
HOST_REDIS_WAREHOUSE=localhost
HOST_REDIS_AUTH=localhost
HOST_REDIS_PRODUCTION=localhost
HOST_REDIS_PURCHASEN=localhost
HOST_REDIS_QC=localhost
HOST_RGPC_PDMM=localhost:5002
HOST_RGPC_SP=localhost:5003
HOST_RGPC_WC=localhost:5002
```