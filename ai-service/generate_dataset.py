# Chạy script này để tạo dataset giả lập có pattern thật


import pandas as pd
import numpy as np
import random

np.random.seed(42)
rows = []

for _ in range(1000):
    # Kịch bản normal (60%)
    scenario = np.random.choice(['normal', 'warning', 'danger'],
                                 p=[0.6, 0.25, 0.15])

    if scenario == 'normal':
        temp = np.random.uniform(25, 30)
        ph   = np.random.uniform(7.0, 8.2)
        oxy  = np.random.uniform(5.0, 8.0)
        turb = np.random.uniform(1.0, 3.0)
        risk = 0  # LOW

    elif scenario == 'warning':
        temp = np.random.uniform(30, 32)
        ph   = np.random.uniform(8.2, 8.5)
        oxy  = np.random.uniform(4.0, 5.0)
        turb = np.random.uniform(3.0, 5.0)
        risk = 1  # MEDIUM

    else:  # danger
        temp = np.random.uniform(32, 36)
        ph   = np.random.choice([
            np.random.uniform(8.5, 9.5),
            np.random.uniform(5.5, 6.5)
        ])
        oxy  = np.random.uniform(1.5, 4.0)
        turb = np.random.uniform(5.0, 10.0)
        risk = 2  # HIGH

    rows.append({
        'temperature': round(temp, 2),
        'ph':          round(ph,   2),
        'oxygen':      round(oxy,  2),
        'turbidity':   round(turb, 2),
        'risk_level':  risk
    })

df = pd.DataFrame(rows)
df.to_csv('data/shrimp_water_quality.csv', index=False)
print(f"Dataset created: {len(df)} rows")
print(df['risk_level'].value_counts())
print(df.describe())