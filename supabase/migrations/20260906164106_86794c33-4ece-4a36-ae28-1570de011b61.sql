
WITH new_orders AS (
  INSERT INTO public.orders (user_id, status, full_name, phone, area, address, subtotal, shipping, total, created_at)
  VALUES
    ('c7644bb7-f835-4ec6-b3c6-f47c89f7d511','delivered','عائشة المهنا','+96599112233','السالمية','قطعة 4، شارع 12، منزل 8', 17.75, 0, 17.75, now() - interval '21 days'),
    ('c7644bb7-f835-4ec6-b3c6-f47c89f7d511','shipped','عائشة المهنا','+96599112233','السالمية','قطعة 4، شارع 12، منزل 8', 12.25, 1.5, 13.75, now() - interval '6 days'),
    ('c7644bb7-f835-4ec6-b3c6-f47c89f7d511','pending','عائشة المهنا','+96599112233','السالمية','قطعة 4، شارع 12، منزل 8', 6.50, 1.5, 8.00, now() - interval '1 day'),
    ('46ca8670-9723-493f-98cd-2a681b60a4f9','processing','نورة الفهد','+96555443322','الجابرية','قطعة 9، شارع 3، منزل 21', 26.65, 0, 26.65, now() - interval '3 days'),
    ('46ca8670-9723-493f-98cd-2a681b60a4f9','cancelled','نورة الفهد','+96555443322','الجابرية','قطعة 9، شارع 3، منزل 21', 3.90, 1.5, 5.40, now() - interval '12 days')
  RETURNING id, status, user_id
)
INSERT INTO public.order_items (order_id, product_id, title, unit_price, qty)
SELECT o.id, i.product_id, i.title, i.unit_price, i.qty
FROM new_orders o
JOIN (VALUES
  ('delivered','arabic-tote','حقيبة عربية',8.00,1),
  ('delivered','harf-mug','كوب حرف',4.75,1),
  ('delivered','tafaseel-poster','بوستر تفاصيل',5.25,1),
  ('shipped','kutub-set','طقم مكتب أثر',12.25,1),
  ('pending','athar-notebook','دفتر أثر',6.50,1),
  ('processing','hawiya-giftbox','صندوق هوية',14.90,1),
  ('processing','zaytoun-decor','طقم زيتون',11.75,1),
  ('cancelled','harf-keychain','ميدالية حرف',3.90,1)
) AS i(status, product_id, title, unit_price, qty)
  ON i.status = o.status;
