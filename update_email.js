const fs = require('fs');

let server = fs.readFileSync('api/server.js', 'utf8');

const newStatsQuery = `
    const statsResult = await pool.query(\`
      SELECT 
        (SELECT COUNT(*) FROM "order" WHERE created_at >= CURRENT_DATE) as "todayOrders",
        (SELECT COALESCE(SUM(CAST(total_amount AS DECIMAL)), 0) FROM "order" WHERE payment_status = 'success' AND created_at >= CURRENT_DATE) as "todayRevenue",
        (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE) as "todayNewUsers",
        (SELECT COUNT(*) FROM generated_image WHERE created_at >= CURRENT_DATE) as "todayGeneratedImages",
        (SELECT COUNT(*) FROM users) as "totalUsers",
        (SELECT COUNT(*) FROM "order") as "totalOrders",
        (SELECT COALESCE(SUM(CAST(total_amount AS DECIMAL)), 0) FROM "order" WHERE payment_status = 'success') as "totalRevenue",
        (SELECT COUNT(*) FROM generated_image) as "totalGeneratedImages"
    \`);
    const stats = statsResult.rows[0];
`;

const oldStatsRegex = /const statsResult = await pool\.query\([\s\S]*?const stats = statsResult\.rows\[0\];/;
server = server.replace(oldStatsRegex, newStatsQuery.trim());

const htmlContentCode = `
    const tlAmount = (Number(stats.todayRevenue) / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const totalRevenueTl = (Number(stats.totalRevenue) / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const todayStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

    const htmlContent = \`
<div style="background-color:#f3f4f6; margin:0; padding:40px 20px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06); max-width: 600px;">
    <tbody>
      <tr>
        <td align="center" style="padding:40px 0 30px 0; background-color:#ffffff; border-bottom:1px solid #f3f4f6">
          <a href="https://admin.birebiro.com" style="text-decoration:none" title="Birebiro Admin">
            <h1 style="color:#4F46E5; font-size:28px; font-weight:800; margin:0; letter-spacing:-1px;">BIREBIRO</h1>
          </a>
          <h2 style="color:#111827; font-size:22px; font-weight:700; margin:20px 0 5px 0; letter-spacing:-0.5px">Sistem İstatistikleri</h2>
          <p style="color:#6b7280; font-size:14px; margin:0">\${todayStr}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:40px 40px">
          <div style="margin-bottom:40px">
            <h2 style="color:#111827; font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 20px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px">Son 24 Saat (Günlük)</h2>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody>
                <tr>
                  <td width="30" style="padding:12px 0; border-bottom:1px solid #f3f4f6"><img src="https://unpkg.com/lucide-static@0.344.0/icons/user-plus.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; color:#374151; font-size:15px">Yeni Kullanıcı Kaydı</td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:700; color:#059669; font-size:16px">+\${stats.todayNewUsers}</td>
                </tr>
                <tr>
                  <td width="30" style="padding:12px 0; border-bottom:1px solid #f3f4f6"><img src="https://unpkg.com/lucide-static@0.344.0/icons/shopping-bag.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; color:#374151; font-size:15px">Bugünkü Siparişler</td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:700; color:#059669; font-size:16px">+\${stats.todayOrders}</td>
                </tr>
                <tr>
                  <td width="30" style="padding:12px 0; border-bottom:1px solid #f3f4f6"><img src="https://unpkg.com/lucide-static@0.344.0/icons/trending-up.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; color:#374151; font-size:15px">Bugünkü Gelir</td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:700; color:#4F46E5; font-size:16px">₺\${tlAmount}</td>
                </tr>
                <tr>
                  <td width="30" style="padding:12px 0"><img src="https://unpkg.com/lucide-static@0.344.0/icons/image.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; color:#374151; font-size:15px">Üretilen Görsel</td>
                  <td style="padding:12px 0; text-align:right; font-weight:700; color:#6b7280; font-size:16px">+\${stats.todayGeneratedImages}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h2 style="color:#111827; font-size:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 20px 0; border-bottom:2px solid #e5e7eb; padding-bottom:8px">Tüm Zamanlar (Genel Durum)</h2>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tbody>
                <tr>
                  <td width="30" style="padding:12px 0; border-bottom:1px solid #f3f4f6"><img src="https://unpkg.com/lucide-static@0.344.0/icons/users.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; color:#374151; font-size:15px">Toplam Kayıtlı Kullanıcı</td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:700; color:#111827; font-size:16px">\${stats.totalUsers}</td>
                </tr>
                <tr>
                  <td width="30" style="padding:12px 0; border-bottom:1px solid #f3f4f6"><img src="https://unpkg.com/lucide-static@0.344.0/icons/shopping-bag.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; color:#374151; font-size:15px">Toplam Sipariş Sayısı</td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:700; color:#111827; font-size:16px">\${stats.totalOrders}</td>
                </tr>
                <tr>
                  <td width="30" style="padding:12px 0; border-bottom:1px solid #f3f4f6"><img src="https://unpkg.com/lucide-static@0.344.0/icons/bar-chart-3.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; color:#374151; font-size:15px">Toplam Gelir</td>
                  <td style="padding:12px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:700; color:#111827; font-size:16px">₺\${totalRevenueTl}</td>
                </tr>
                <tr>
                  <td width="30" style="padding:12px 0"><img src="https://unpkg.com/lucide-static@0.344.0/icons/image.svg" width="20" height="20" style="opacity:0.6" alt="Icon"></td>
                  <td style="padding:12px 0; color:#374151; font-size:15px">Toplam Üretilen Görsel</td>
                  <td style="padding:12px 0; text-align:right; font-weight:700; color:#111827; font-size:16px">\${stats.totalGeneratedImages}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style="margin-top:40px; padding-top:20px; border-top:1px solid #f3f4f6; text-align:center">
            <a href="https://admin.birebiro.com/pages/dashboard" style="display:inline-block; padding:12px 24px; background-color:#4F46E5; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; border-radius:8px; margin-bottom:20px" title="Panele Git">Panele Git</a>
            <p style="color:#9ca3af; font-size:12px; margin:0 0 10px 0; line-height:1.5">Bu e-posta Birebiro Admin Sistemi tarafından otomatik olarak oluşturulmuştur.<br>Rapor alıcılarını Admin Paneli &gt; Genel Bakış sayfasından yönetebilirsiniz.</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
\`;
`;

const oldHtmlRegex = /const tlAmount =[\s\S]*?const htmlContent = `[\s\S]*?`;\n/;
server = server.replace(oldHtmlRegex, htmlContentCode);

fs.writeFileSync('api/server.js', server);
console.log('Template updated successfully!');
