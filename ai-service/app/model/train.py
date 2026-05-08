import pandas as pd
import numpy as np
import pickle
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix
)
from sklearn.preprocessing import StandardScaler

def train():
    print("=" * 50)
    print("Training Random Forest Model")
    print("=" * 50)

    # 1. Load dataset
    df = pd.read_csv('data/shrimp_water_quality.csv')
    print(f"Dataset: {len(df)} rows")
    print(f"Label distribution:\n{df['risk_level'].value_counts()}")

    # 2. Features + Labels
    X = df[['temperature', 'ph', 'oxygen', 'turbidity']].values
    y = df['risk_level'].values

    # 3. Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 4. Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    # 5. Train Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    model.fit(X_train_scaled, y_train)

    # 6. Evaluate
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)

    print(f"\nAccuracy: {acc:.4f} ({acc*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(
        y_test, y_pred,
        target_names=['LOW', 'MEDIUM', 'HIGH']
    ))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Feature importance
    feature_names = ['temperature', 'ph', 'oxygen', 'turbidity']
    importances = model.feature_importances_
    print("\nFeature Importance:")
    for name, imp in sorted(
        zip(feature_names, importances),
        key=lambda x: x[1], reverse=True
    ):
        print(f"  {name}: {imp:.4f}")

    # 7. Save model + scaler + metrics
    with open('app/model/model.pkl', 'wb') as f:
        pickle.dump(model, f)

    with open('app/model/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)

    metrics = {
        'accuracy': round(acc, 4),
        'n_samples': len(df),
        'n_train': len(X_train),
        'n_test': len(X_test),
        'feature_importance': {
            name: round(float(imp), 4)
            for name, imp in zip(feature_names, importances)
        }
    }
    with open('app/model/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)

    print(f"\nModel saved to app/model/model.pkl")
    print(f"Scaler saved to app/model/scaler.pkl")
    print(f"Metrics saved to app/model/metrics.json")
    print("=" * 50)
    print("Training complete!")

if __name__ == '__main__':
    train()