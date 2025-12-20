# 🔥 Hướng Dẫn Tạo Firestore Index

## ❗ Vấn Đề

Khi chạy app, bạn có thể gặp lỗi:

```
Error: 9 FAILED_PRECONDITION: The query requires an index.
```

Đây là lỗi bình thường khi sử dụng Firestore với **composite queries** (query có nhiều điều kiện).

## 🎯 Giải Pháp

### Option 1: Tạo Index Tự Động (KHUYÊN DÙNG)

1. **Copy link trong error message** (hoặc mở Firebase Console)

2. **Hoặc tạo thủ công:**
   - Mở [Firebase Console](https://console.firebase.google.com/)
   - Chọn project: `nuoi-buituantu`
   - Vào **Firestore Database** → **Indexes** tab
   - Click **"Create Index"**

3. **Điền thông tin:**
   - **Collection ID**: `donations`
   - **Fields to index**:
     - Field: `status`, Order: `Ascending`
     - Field: `createdAt`, Order: `Descending`
   - **Query scope**: Collection

4. **Click "Create"**

5. **Đợi index được build** (2-10 phút tùy data)

6. **Refresh trang web** - Lỗi sẽ mất!

### Option 2: Sử dụng Firebase CLI

Tạo file `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "donations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

Deploy indexes:

```bash
firebase deploy --only firestore:indexes
```

### Option 3: Code Workaround (Tạm thời)

Code đã được update để filter trong memory thay vì trong Firestore query.

**Lưu ý:** Workaround này hoạt động nhưng:
- ⚠️ Kém performance hơn
- ⚠️ Sử dụng nhiều reads hơn
- ⚠️ Nên tạo index đúng cách

## 📊 Composite Index Là Gì?

Firestore tự động tạo **single-field indexes** nhưng yêu cầu bạn tạo **composite indexes** cho queries phức tạp.

### Ví Dụ Cần Index:

```typescript
// ✅ Không cần composite index (chỉ orderBy)
db.collection("donations")
  .orderBy("createdAt", "desc")
  .get();

// ❌ CẦN composite index (where + orderBy)
db.collection("donations")
  .where("status", "==", "completed")
  .orderBy("createdAt", "desc")
  .get();

// ❌ CẦN composite index (nhiều where)
db.collection("donations")
  .where("status", "==", "completed")
  .where("amount", ">", 1000)
  .get();
```

## 🎓 Best Practices

### 1. Index Exemptions

Một số queries KHÔNG cần composite index:
- Single `where` clause
- Single `orderBy`
- `where` với equality (==) chỉ có 1 field

### 2. Monitoring Index Usage

Check trong Firebase Console:
- **Firestore** → **Usage** tab
- Monitor số lượng reads/writes
- Check index size

### 3. Index Limits

Firestore có limits:
- Max 200 composite indexes per project
- Max 1.5MB index entry size

### 4. Development vs Production

**Development:**
- Firebase tự suggest indexes khi query
- Click link trong error để tạo

**Production:**
- Plan indexes trước
- Test queries trước khi deploy
- Use `firestore.indexes.json`

## 🐛 Troubleshooting

### Index đang "Building"

```
Status: Building (5 minutes remaining)
```

**Solution:** Đợi. Không thể query trong lúc này.

### Index Creation Failed

```
Error creating index
```

**Solutions:**
- Check collection name đúng không
- Check field names match exactly
- Check quotas/limits

### Query vẫn lỗi sau khi tạo index

**Solutions:**
1. Đợi thêm vài phút (index propagation)
2. Clear cache
3. Restart server
4. Check index status trong Console

## 📝 Index Configuration File

Để dễ deploy, tạo `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "donations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Commit file này vào Git để team khác cũng có cùng indexes.

## 🎯 For This Project

Index cần thiết cho project:

### 1. Donations Query
- **Collection**: `donations`
- **Fields**: `status` (ASC) + `createdAt` (DESC)
- **Usage**: API `/api/donations`

### Future Indexes (nếu thêm features)

```typescript
// Search by donor name
// Index: donorName (ASC) + createdAt (DESC)

// Filter by amount range
// Index: status (ASC) + amount (DESC)

// Filter by date range
// Index: status (ASC) + createdAt (ASC)
```

## 💰 Cost Impact

Indexes ảnh hưởng đến cost:
- **Storage**: Mỗi index chiếm storage
- **Writes**: Mỗi write update tất cả indexes
- **No impact on reads**

**Example:**
- 1000 documents với 2 composite indexes
- Storage: ~2MB
- Cost: Negligible trong free tier

## 🔗 Resources

- [Firestore Index Overview](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Index Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Query Limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations)

## ✅ Quick Fix Checklist

- [ ] Click link trong error message
- [ ] Tạo index trong Firebase Console
- [ ] Đợi "Building" → "Enabled"
- [ ] Restart dev server
- [ ] Refresh browser
- [ ] ✅ Donations hiển thị!

---

**Lưu ý:** Sau khi tạo index, xóa code workaround và revert về query gốc để có performance tốt nhất!



