
docker logs id_logs  > logs.txt

-- lấy thười gian cụ thể 
docker logs --since "2h" 76bb4b6f925f > logs.txt


docker logs --since "1h" --until "30m" 76bb4b6f925f > logs.txt
-- lấy ngày cụ thể 
docker logs --since "2025-03-05T00:00:00" 76bb4b6f925f > logs.txt





 docker exec -it 47f6e76b2eee redis-cli


 -- Chay riêng lẻ 2 con 

 docker-compose up --build --force-recreate microservice-upload microservice-scancode -d 




-- redis check 

sc delete Redis_warehouse

<!-- BẢN REDIS DEV -->
<!-- Ở DẢI ĐẦU PORT 6 -->
sc create redis_warehouse_dev binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_dev\redis_warehouse.conf\"" start= auto

sc create redis_auth_dev binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_dev\redis_auth.conf\"" start= auto

sc create redis_production_dev binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_dev\redis_production.conf\"" start= auto

sc create redis_purchase_dev binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_dev\redis_purchase.conf\"" start= auto

sc create redis_qc_dev binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_dev\redis_qc.conf\"" start= auto


sc start  redis_auth_dev
sc start  redis_warehouse_dev
sc start  redis_production_dev
sc start  redis_purchase_dev
sc start  redis_qc_dev


sc query  redis_auth_dev
sc query  redis_warehouse_dev
sc query  redis_production_dev
sc query  redis_purchase_dev
sc query  redis_qc_dev




<!-- BẢN REDIS PRODUTION ERP V1.0.0 -->
<!-- Ở DẢI ĐẦU PORT 7 -->
sc create redis_warehouse_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_v1.0.0\redis_warehouse.conf\"" start= auto

sc create redis_auth_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_v1.0.0\redis_auth.conf\"" start= auto

sc create redis_production_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_v1.0.0\redis_production.conf\"" start= auto

sc create redis_purchase_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_v1.0.0\redis_purchase.conf\"" start= auto

sc create redis_qc_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\instances_v1.0.0\redis_qc.conf\"" start= auto







sc start  redis_warehouse_v1
sc start  redis_auth_v1
sc start  redis_production_v1
sc start  redis_purchase_v1
sc start  redis_qc_v1



sc query redis_warehouse_v1
sc query redis_auth_v1
sc query redis_production_v1
sc query redis_purchase_v1
sc query redis_qc_v1










-- Vào tưng con 1 

redis-cli -p 6383


check portt: netstat -ano | findstr LISTENING | findstr :63


<!--  BẢN EEP JIG REDIS PORT -->

sc create redis_warehouse_jig_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\jig_v1\redis_warehouse.conf\"" start= auto

sc create redis_auth_jig_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\jig_v1\redis_auth.conf\"" start= auto

sc create redis_production_jig_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\jig_v1\redis_production.conf\"" start= auto

sc create redis_purchase_jig_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\jig_v1\redis_purchase.conf\"" start= auto

sc create redis_qc_jig_v1 binPath= "\"C:\Program Files\Redis\redis-server.exe\" --service-run \"C:\Program Files\Redis\jig_v1\redis_qc.conf\"" start= auto


sc start  redis_warehouse_jig_v1
sc start  redis_auth_jig_v1
sc start  redis_production_jig_v1
sc start  redis_purchase_jig_v1
sc start  redis_qc_jig_v1

sc query  redis_warehouse_jig_v1
sc query  redis_auth_jig_v1
sc query  redis_production_jig_v1
sc query  redis_purchase_jig_v1
sc query  redis_qc_jig_v1
