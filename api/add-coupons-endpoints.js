const fs = require('fs');

const endpoints = `
// ==================== COUPONS & DISCOUNTS API ====================

// Get all coupons
app.get('/api/coupons', async (req, res) => {
  try {
    const result = await pool.query(\`
      SELECT 
        c.id, c.code, c.discount_type as "discountType", c.discount_value as "discountValue",
        c.applicability, c.product_id as "productId", c.created_at as "createdAt",
        c.is_active as "isActive", c.usage_count as "usageCount",
        p.name as "productName"
      FROM coupons c
      LEFT JOIN product p ON c.product_id = p.id
      ORDER BY c.created_at DESC
    \`);
    res.json(result.rows);
  } catch (error) {
    console.error('Coupons fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Create new coupon
app.post('/api/coupons', async (req, res) => {
  try {
    const { code, discountType, discountValue, applicability, productId } = req.body;
    
    // Check if code already exists
    const existing = await pool.query('SELECT id FROM coupons WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Bu kupon kodu zaten mevcut.' });
    }

    const result = await pool.query(\`
      INSERT INTO coupons (code, discount_type, discount_value, applicability, product_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id, code, discount_type as "discountType", discount_value as "discountValue",
        applicability, product_id as "productId", created_at as "createdAt",
        is_active as "isActive", usage_count as "usageCount"
    \`, [code, discountType, discountValue, applicability, applicability === 'product' ? productId : null]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Coupon create error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// Update coupon
app.put('/api/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, applicability, productId, isActive } = req.body;

    const result = await pool.query(\`
      UPDATE coupons SET
        code = COALESCE($1, code),
        discount_type = COALESCE($2, discount_type),
        discount_value = COALESCE($3, discount_value),
        applicability = COALESCE($4, applicability),
        product_id = COALESCE($5, product_id),
        is_active = COALESCE($6, is_active)
      WHERE id = $7
      RETURNING *
    \`, [code, discountType, discountValue, applicability, applicability === 'product' ? productId : null, isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kupon bulunamadı.' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Coupon update error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// Delete coupon
app.delete('/api/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM coupons WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kupon bulunamadı.' });
    }
    res.json({ success: true, message: 'Kupon silindi.' });
  } catch (error) {
    console.error('Coupon delete error:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// Compression middleware`;

let fileContent = fs.readFileSync('server.js', 'utf8');
fileContent = fileContent.replace('// Compression middleware', endpoints);
fs.writeFileSync('server.js', fileContent);
console.log('Endpoints added to server.js');
