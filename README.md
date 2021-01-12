# BeaconsNavigation


 current solution based on noble node js module wich is BLE central module " collects peripheral signals include (uuid,rssi,..etc)"

## methodology

- collecting RSSI values for each UUID .
- RSSI filtering (under investigation area) to get accurate valus , BLE signals have high standard deviation so we shouldn't trust single reading for distance estimation .
- catch the nearest 3 points .
- apply Trilateration to get current position .
