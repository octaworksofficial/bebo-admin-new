const fs = require('fs');

let server = fs.readFileSync('server.js', 'utf8');

const newEndpoints = `
// Get all coupons
app.get('/api/coupons', async (req, res) => {
  try {
    const result = await pool.query(\`
      SELECT 
        c.id, c.code, c.discount_type as "discountType", c.discount_value as "discountValue",
        c.applicability, c.product_id as "productId", c.created_at as "createdAt",
        c.is_active as "isActive", c.usage_count as "usageCount",
        c.max_usage_per_user as "maxUsagePerUser", c.max_total_usage as "maxTotalUsage",
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
    const { code, discountType, discountValue, applicability, productId, maxUsagePerUser, maxTotalUsage } = req.body;
    
    // Check if code already exists
    const existing = await pool.query('SELECT id FROM coupons WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Bu kupon kodu zaten mevcut.' });
    }

    const result = await pool.query(\`
      INSERT INTO coupons (code, discount_type, discount_value, applicability, product_id, max_usage_per_user, max_total_usage)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, code, discount_type as "discountType", discount_value as "discountValue",
        applicability, product_id as "productId", created_at as "createdAt",
        is_active as "isActive", usage_count as "usageCount",
        max_usage_per_user as "maxUsagePerUser", max_total_usage as "maxTotalUsage"
    \`, [code, discountType, discountValue, applicability, applicability === 'product' ? productId : null, maxUsagePerUser || 1, maxTotalUsage || null]);
    
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
    const { code, discountType, discountValue, applicability, productId, isActive, maxUsagePerUser, maxTotalUsage } = req.body;

    const result = await pool.query(\`
      UPDATE coupons SET
        code = COALESCE($1, code),
        discount_type = COALESCE($2, discount_type),
        discount_value = COALESCE($3, discount_value),
        applicability = COALESCE($4, applicability),
        product_id = COALESCE($5, product_id),
        is_active = COALESCE($6, is_active),
        max_usage_per_user = COALESCE($7, max_usage_per_user),
        max_total_usage = COALESCE($8, max_total_usage)
      WHERE id = $9
      RETURNING *
    \`, [code, discountType, discountValue, applicability, applicability === 'product' ? productId : null, isActive, maxUsagePerUser, maxTotalUsage, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kupon bulunamadı.' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Coupon update error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});
`;

const startIndex = server.indexOf('// Get all coupons');
const endIndex = server.indexOf('// Delete coupon');
if (startIndex !== -1 && endIndex !== -1) {
  server = server.substring(0, startIndex) + newEndpoints + '\n' + server.substring(endIndex);
  fs.writeFileSync('server.js', server);
  console.log('Endpoints updated');
} else {
  console.log('Could not find start/end index');
}
