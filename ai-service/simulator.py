import requests
import random
import time
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

JAVA_API_URL = os.getenv("JAVA_API_URL", "http://localhost:8080")
INTERVAL = int(os.getenv("SIMULATE_INTERVAL", "30"))

# Danh sach ao can gia lap — them pond_id vao day
POND_IDS = [1]

def generate_sensor_data(pond_id, scenario="normal"):
    """
    Tao du lieu cam bien theo kich ban
    normal   — moi truong on dinh
    warning  — dang xuong cap nguy hiem
    danger   — vuot nguong nguy hiem
    """
    if scenario == "normal":
        return {
            "pondId": pond_id,
            "temperature": round(random.uniform(26.0, 30.0), 1),
            "ph":          round(random.uniform(7.0,  8.2),  2),
            "oxygen":      round(random.uniform(5.0,  7.0),  2),
            "turbidity":   round(random.uniform(1.0,  3.0),  2)
        }
    elif scenario == "warning":
        return {
            "pondId": pond_id,
            "temperature": round(random.uniform(30.0, 32.0), 1),
            "ph":          round(random.uniform(8.2,  8.5),  2),
            "oxygen":      round(random.uniform(4.0,  5.0),  2),
            "turbidity":   round(random.uniform(3.0,  5.0),  2)
        }
    elif scenario == "danger":
        return {
            "pondId": pond_id,
            "temperature": round(random.uniform(32.0, 35.0), 1),
            "ph":          round(random.uniform(8.6,  9.2),  2),
            "oxygen":      round(random.uniform(2.0,  3.9),  2),
            "turbidity":   round(random.uniform(5.0,  8.0),  2)
        }

def send_sensor_data(data):
    """Gui du lieu len Java API"""
    try:
        res = requests.post(
            f"{JAVA_API_URL}/api/sensor",
            json=data,
            timeout=5
        )
        if res.status_code == 200:
            print(f"[OK] Pond {data['pondId']} — "
                  f"temp={data['temperature']}°C "
                  f"pH={data['ph']} "
                  f"O2={data['oxygen']}mg/L "
                  f"({datetime.now().strftime('%H:%M:%S')})")
        else:
            print(f"[WARN] Pond {data['pondId']} — "
                  f"Status {res.status_code}")
    except requests.exceptions.ConnectionError:
        print(f"[ERROR] Khong ket noi duoc Java API — "
              f"kiem tra Spring Boot co dang chay khong")
    except Exception as e:
        print(f"[ERROR] {e}")

def get_scenario(cycle):
    """
    Xoay vong kich ban de demo
    0-4   — binh thuong (2.5 phut)
    5-6   — canh bao    (1 phut)
    7     — nguy hiem   (30 giay)
    8-9   — binh thuong (1 phut)
    """
    if cycle % 10 < 5:
        return "normal"
    elif cycle % 10 < 7:
        return "warning"
    elif cycle % 10 < 8:
        return "danger"
    else:
        return "normal"

def main():
    print("=" * 50)
    print("IoT Simulator - AquaMonitor")
    print(f"Java API: {JAVA_API_URL}")
    print(f"Interval: {INTERVAL} giay")
    print(f"Ponds: {POND_IDS}")
    print("=" * 50)
    print("Nhan Ctrl+C de dung...")
    print()

    cycle = 0
    while True:
        scenario = get_scenario(cycle)
        print(f"--- Cycle {cycle} | Scenario: {scenario} ---")

        for pond_id in POND_IDS:
            data = generate_sensor_data(pond_id, scenario)
            send_sensor_data(data)

        cycle += 1
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()