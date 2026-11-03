-- FoodBridge SQL Queries Demonstration
-- This file contains meaningful SQL queries to demonstrate DBMS concepts
-- All queries are based on the actual FoodBridge database schema

USE foodbridge;

/* ==============================================================================
   BASIC CRUD OPERATIONS
   ============================================================================= */

-- 1. SELECT all available food donations
SELECT
    fd.donation_id,
    fi.name AS food_item_name,
    fd.available_quantity,
    fd.unit,
    fd.expiry_date,
    fd.status,
    o.org_name AS donor_name
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
JOIN organizations o ON fd.donor_id = o.org_id
WHERE fd.status = 'PENDING'
  AND fd.available_quantity > 0
  AND fd.expiry_date >= CURRENT_DATE()
ORDER BY fd.expiry_date ASC;

-- 2. INSERT a food donation
INSERT INTO food_donations (
    donation_id,
    food_item_id,
    donor_id,
    requested_quantity,
    available_quantity,
    unit,
    expiry_date,
    storage_requirement,
    status,
    pickup_address,
    pickup_notes
) VALUES (
    'DON-2024-001',
    101,
    1,
    100.0,
    100.0,
    'KG',
    '2024-12-31',
    'REFRIGERATED',
    'PENDING',
    '123 Main St, City',
    'Call before pickup'
);

-- 3. UPDATE a donation quantity
UPDATE food_donations
SET
    available_quantity = 85.0,
    status = 'ALLOCATED',
    updated_at = CURRENT_TIMESTAMP
WHERE
    donation_id = 'DON-2024-001'
    AND available_quantity >= 85.0;

-- 4. DELETE or deactivate a donation
UPDATE food_donations
SET
    status = 'CANCELLED',
    updated_at = CURRENT_TIMESTAMP
WHERE
    donation_id = 'DON-2024-001';

/* ==============================================================================
   JOIN OPERATIONS
   ============================================================================= */

-- 5. JOIN users and donations
SELECT
    u.full_name,
    u.email,
    o.org_name AS organization,
    fd.donation_id,
    fd.available_quantity,
    fd.unit,
    fd.status
FROM users u
JOIN organizations o ON u.user_id = o.user_id
JOIN food_donations fd ON o.org_id = fd.donor_id
WHERE
    u.role = 'DONOR'
    AND fd.status IN ('PENDING', 'ALLOCATED')
ORDER BY fd.status, fd.available_quantity DESC;

-- 6. JOIN food requests and allocations
SELECT
    fr.request_id,
    o.org_name AS requestor,
    fc.category_name AS category,
    fr.requested_quantity,
    fr.unit,
    fr.urgency,
    a.allocated_quantity AS allocated,
    a.status AS allocation_status,
    a.allocation_date
FROM food_requests fr
JOIN organizations o ON fr.requestor_id = o.org_id
JOIN food_categories fc ON fr.category_id = fc.category_id
LEFT JOIN allocations a ON fr.request_id = a.request_id
WHERE
    fr.status IN ('APPROVED', 'COMPLETED')
ORDER BY fr.urgency DESC, fr.created_at;

/* ==============================================================================
   AGGREGATION FUNCTIONS
   ============================================================================= */

-- 7. GROUP BY food category
SELECT
    fc.category_name,
    COUNT(DISTINCT fi.item_id) AS food_items_count,
    COUNT(DISTINCT fd.donation_id) AS donation_count,
    SUM(fd.available_quantity) AS total_quantity_available,
    AVG(fi.safety_rating) AS average_safety_rating,
    MIN(fi.expiry_date) AS earliest_expiry,
    MAX(fi.expiry_date) AS latest_expiry
FROM food_categories fc
LEFT JOIN food_items fi ON fc.category_id = fi.category_id
LEFT JOIN food_donations fd ON fi.item_id = fd.food_item_id
WHERE fc.is_active = TRUE
GROUP BY fc.category_id, fc.category_name
HAVING COUNT(DISTINCT fd.donation_id) > 0
ORDER BY total_quantity_available DESC;

-- 8. COUNT total donations
SELECT
    COUNT(*) AS total_donations,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) AS pending_donations,
    COUNT(CASE WHEN status = 'ALLOCATED' THEN 1 END) AS allocated_donations,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS completed_donations,
    COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) AS cancelled_donations,
    COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) AS approved_donations
FROM food_donations;

-- 9. SUM total redistributed quantity
SELECT
    SUM(a.allocated_quantity) AS total_redistributed_quantity,
    COUNT(DISTINCT a.allocation_id) AS total_allocations,
    AVG(a.allocated_quantity) AS average_allocation_size,
    MIN(a.allocation_date) AS first_allocation,
    MAX(a.allocation_date) AS last_allocation
FROM allocations a
JOIN food_requests fr ON a.request_id = fr.request_id
WHERE
    a.status = 'COMPLETED'
    AND fr.status = 'COMPLETED';

-- 10. Find food expiring within 24 hours
SELECT
    fi.name,
    fd.donation_id,
    fi.expiry_date,
    TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP, fi.expiry_date * INTERVAL 1 DAY) AS hours_until_expiry,
    fi.storage_requirement,
    o.org_name AS donor_organization
FROM food_items fi
JOIN food_donations fd ON fi.item_id = fd.food_item_id
JOIN organizations o ON fi.donor_id = o.org_id
WHERE
    fi.status IN ('normal', 'urgent', 'critical')
    AND fi.expiry_date <= CURRENT_DATE() + INTERVAL 1 DAY
    AND fi.expiry_date >= CURRENT_DATE()
ORDER BY fi.expiry_date ASC;

/* ==============================================================================
   ADVANCED QUERIES
   ============================================================================= */

-- 11. Find donors with the highest number of donations
SELECT
    o.org_name AS donor_name,
    COUNT(fd.donation_id) AS donation_count,
    COUNT(DISTINCT fi.item_id) AS food_items_donated,
    SUM(fd.requested_quantity) AS total_quantity_donated,
    AVG(fi.safety_rating) AS average_safety_rating
FROM organizations o
JOIN food_donations fd ON o.org_id = fd.donor_id
JOIN food_items fi ON fd.food_item_id = fi.item_id
GROUP BY o.org_id, o.org_name
HAVING COUNT(fd.donation_id) > 0
ORDER BY donation_count DESC, total_quantity_donated DESC
LIMIT 10;

-- 12. Find NGOs with the highest number of completed collections
SELECT
    o.org_name AS ngo_name,
    COUNT(p.pickup_id) AS completed_collections,
    COUNT(DISTINCT fd.donation_id) AS donations_collected,
    SUM(fd.available_quantity) AS total_quantity_collected,
    AVG(p.pickup_date) AS average_pickup_date
FROM organizations o
JOIN pickups p ON o.org_id = p.volunteer_id
JOIN food_donations fd ON p.donation_id = fd.donation_id
WHERE
    p.status = 'COMPLETED'
    AND fd.status = 'COMPLETED'
    AND o.org_name LIKE '%NGO%' OR o.org_name LIKE '%Non-Profit%' OR o.org_name LIKE '%Association%'
GROUP BY o.org_id, o.org_name
HAVING COUNT(p.pickup_id) > 0
ORDER BY completed_collections DESC, total_quantity_collected DESC
LIMIT 10;

-- 13. Use a subquery to identify donors above the average donation count
SELECT
    org_name AS donor_name,
    donation_count,
    CASE
        WHEN donation_count > avg_donation_count THEN 'ABOVE_AVERAGE'
        WHEN donation_count = avg_donation_count THEN 'AT_AVERAGE'
        ELSE 'BELOW_AVERAGE'
    END AS performance_category,
    RANK() OVER (ORDER BY donation_count DESC) AS donation_rank
FROM (
    SELECT
        o.org_name,
        COUNT(fd.donation_id) AS donation_count
    FROM organizations o
    JOIN food_donations fd ON o.org_id = fd.donor_id
    GROUP BY o.org_id, o.org_name
) AS donor_counts
CROSS JOIN (
    SELECT AVG(donation_count) AS avg_donation_count
    FROM (
        SELECT COUNT(fd.donation_id) AS donation_count
        FROM organizations o
        JOIN food_donations fd ON o.org_id = fd.donor_id
        GROUP BY o.org_id
    ) AS all_donor_counts
) AS avg_calculation
WHERE donation_count > 0
ORDER BY donation_count DESC;

-- 14. Use ORDER BY to display urgent donations first
SELECT
    fd.donation_id,
    fi.name AS food_item,
    fd.available_quantity,
    fd.expiry_date,
    DATEDIFF(fd.expiry_date, CURRENT_DATE()) AS days_until_expiry,
    fi.status AS item_status,
    o.org_name AS donor_name,
    CASE
        WHEN DATEDIFF(fd.expiry_date, CURRENT_DATE()) <= 0 THEN 3
        WHEN DATEDIFF(fd.expiry_date, CURRENT_DATE()) <= 3 THEN 2
        WHEN DATEDIFF(fd.expiry_date, CURRENT_DATE()) <= 7 THEN 1
        ELSE 0
    END AS urgency_level,
    CASE
        WHEN fi.status = 'expired' THEN 'CRITICAL'
        WHEN DATEDIFF(fd.expiry_date, CURRENT_DATE()) <= 0 THEN 'EXPIRED'
        WHEN DATEDIFF(fd.expiry_date, CURRENT_DATE()) <= 3 THEN 'URGENT'
        WHEN DATEDIFF(fd.expiry_date, CURRENT_DATE()) <= 7 THEN 'SOON_EXPIRING'
        ELSE 'NORMAL'
    END AS status_display
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
JOIN organizations o ON fd.donor_id = o.org_id
WHERE fd.status = 'PENDING' AND fd.available_quantity > 0
ORDER BY
    urgency_level DESC,
    days_until_expiry ASC,
    fi.status ASC;

-- 15. Complex JOIN with multiple conditions
SELECT
    fr.request_id,
    o1.org_name AS requestor_name,
    fc.category_name,
    fr.requested_quantity,
    fr.unit,
    fr.urgency,
    fr.preferred_pickup_date,
    COUNT(a.allocation_id) AS allocated_count,
    SUM(a.allocated_quantity) AS total_allocated,
    CASE
        WHEN fr.requested_quantity = SUM(COALESCE(a.allocated_quantity, 0)) THEN 'FULLY_ALLOCATED'
        WHEN SUM(COALESCE(a.allocated_quantity, 0)) = 0 THEN 'NOT_ALLOCATED'
        ELSE 'PARTIALLY_ALLOCATED'
    END AS allocation_status,
    fr.created_at,
    fr.status AS request_status
FROM food_requests fr
JOIN organizations o1 ON fr.requestor_id = o1.org_id
JOIN food_categories fc ON fr.category_id = fc.category_id
LEFT JOIN allocations a ON fr.request_id = a.request_id AND a.status IN ('CONFIRMED', 'COMPLETED')
WHERE fr.status IN ('APPROVED', 'COMPLETED')
GROUP BY fr.request_id, o1.org_name, fc.category_name, fr.requested_quantity,
          fr.unit, fr.urgency, fr.preferred_pickup_date, fr.created_at, fr.status
HAVING fr.requested_quantity > 0
ORDER BY fr.urgency DESC, fr.created_at DESC;

-- 16. Window function for ranking analysis
SELECT
    RANK() OVER (ORDER BY total_donations DESC) AS donation_rank,
    DENSE_RANK() OVER (ORDER BY total_quantity DESC) AS quantity_rank,
    ROW_NUMBER() OVER (ORDER BY created_at DESC) AS newest_donor_rank,
    org_name,
    total_donations,
    total_quantity,
    CASE
        WHEN RANK() OVER (ORDER BY total_donations DESC) <= 3 THEN 'TOP_CONTRIBUTOR'
        WHEN RANK() OVER (ORDER BY total_quantity DESC) <= 3 THEN 'TOP_QUANTITY_DONOR'
        ELSE 'REGULAR_DONOR'
    END AS donor_category,
    LAG(total_donations) OVER (ORDER BY total_donations DESC) AS previous_donor_count
FROM (
    SELECT
        o.org_name,
        COUNT(fd.donation_id) AS total_donations,
        SUM(fd.requested_quantity) AS total_quantity,
        o.created_at
    FROM organizations o
    JOIN food_donations fd ON o.org_id = fd.donor_id
    WHERE o.is_verified = TRUE
    GROUP BY o.org_id, o.org_name, o.created_at
) AS donor_stats
ORDER BY total_donations DESC, total_quantity DESC;

/* ==============================================================================
   TRANSACTION DEMONSTRATION QUERIES
   ============================================================================= */

-- Query to check transaction constraints before allocation
SELECT
    fd.donation_id,
    fd.available_quantity,
    fd.status AS donation_status,
    fi.expiry_date,
    CASE
        WHEN fd.available_quantity < 10 THEN 'LOW_STOCK'
        WHEN fd.available_quantity < 50 THEN 'MEDIUM_STOCK'
        ELSE 'GOOD_STOCK'
    END AS stock_level,
    CASE
        WHEN fi.expiry_date <= CURRENT_DATE() + INTERVAL 1 DAY THEN 'EXPIRING_TODAY'
        WHEN fi.expiry_date <= CURRENT_DATE() + INTERVAL 7 DAY THEN 'EXPIRING_SOON'
        ELSE 'GOOD_SHELF_LIFE'
    END AS expiry_status
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
WHERE
    fd.status = 'ALLOCATED'
    AND (fd.available_quantity < 10 OR fi.expiry_date <= CURRENT_DATE() + INTERVAL 7 DAY);

-- Query for transaction audit logging
SELECT
    ah.log_id,
    u.full_name AS performed_by,
    ah.action,
    ah.entity_type,
    ah.entity_id,
    ah.performed_at,
    ah.reason,
    CASE
        WHEN ah.action = 'CREATE' THEN 'INSERT'
        WHEN ah.action = 'UPDATE' THEN 'MODIFY'
        WHEN ah.action = 'DELETE' THEN 'REMOVE'
        WHEN ah.action = 'STATUS_CHANGE' THEN 'STATUS_UPDATE'
        ELSE 'OTHER'
    END AS operation_type,
    CASE
        WHEN ah.entity_type = 'FoodDonation' THEN 'FOOD_DONATION'
        WHEN ah.entity_type = 'FoodRequest' THEN 'FOOD_REQUEST'
        WHEN ah.entity_type = 'Organization' THEN 'ORGANIZATION'
        WHEN ah.entity_type = 'User' THEN 'USER'
        ELSE 'OTHER'
    END AS entity_display_name
FROM audit_logs ah
JOIN users u ON ah.user_id = u.user_id
WHERE ah.entity_type IN ('FoodDonation', 'FoodRequest', 'Organization', 'User')
ORDER BY ah.performed_at DESC
LIMIT 50;

-- ==============================================================================
   PERFORMANCE ANALYSIS QUERIES
   -- ==============================================================================

-- Query to identify performance bottlenecks
SELECT
    TABLE_NAME,
    AVG(ROWS_EXAMINED) AS avg_rows_examined,
    AVG(ROWS_SENT) AS avg_rows_sent,
    AVG(ELAPSED_TIME) AS avg_elapsed_time_ms,
    MAX(ROWS_EXAMINED) AS max_rows_examined,
    COUNT(*) AS query_count
FROM performance_schema.events_statements_summary_by_digest
WHERE TABLE_SCHEMA = 'foodbridge'
GROUP BY TABLE_NAME
ORDER BY avg_elapsed_time_ms DESC
LIMIT 10;

-- ==============================================================================
   DATA ANALYTICS AND REPORTING
   -- ==============================================================================

-- Monthly donation analytics
SELECT
    DATE_FORMAT(fd.created_at, '%Y-%m') AS month,
    COUNT(fd.donation_id) AS donations_created,
    SUM(fd.available_quantity) AS total_quantity_donated,
    COUNT(DISTINCT fd.donor_id) AS unique_donors,
    AVG(fi.safety_rating) AS average_safety_rating,
    CASE
        WHEN COUNT(fd.donation_id) > 100 THEN 'HIGH'
        WHEN COUNT(fd.donation_id) > 50 THEN 'MEDIUM'
        ELSE 'LOW'
    END AS activity_level
FROM food_donations fd
JOIN food_items fi ON fd.food_item_id = fi.item_id
WHERE fd.created_at >= CURRENT_DATE() - INTERVAL 12 MONTH
GROUP BY DATE_FORMAT(fd.created_at, '%Y-%m')
ORDER BY month DESC;

-- User engagement metrics
SELECT
    u.user_id,
    u.full_name,
    u.role,
    COUNT(DISTINCT o.org_id) AS organizations_managed,
    COUNT(DISTINCT fd.donation_id) AS donations_created,
    COUNT(DISTINCT fr.request_id) AS requests_submitted,
    COUNT(DISTINCT p.pickup_id) AS pickups_scheduled,
    COUNT(DISTINCT n.notification_id) AS notifications_received,
    CASE
        WHEN COUNT(DISTINCT fd.donation_id) > 10 THEN 'HIGH_ACTIVITY'
        WHEN COUNT(DISTINCT fd.donation_id) > 5 THEN 'MEDIUM_ACTIVITY'
        ELSE 'LOW_ACTIVITY'
    END AS engagement_level,
    CASE
        WHEN u.last_login >= CURRENT_DATE() - INTERVAL 7 DAY THEN 'ACTIVE'
        WHEN u.last_login >= CURRENT_DATE() - INTERVAL 30 DAY THEN 'WEEKLY_ACTIVE'
        WHEN u.last_login >= CURRENT_DATE() - INTERVAL 90 DAY THEN 'MONTHLY_ACTIVE'
        ELSE 'INACTIVE'
    END AS login_status
FROM users u
LEFT JOIN organizations o ON u.user_id = o.user_id
LEFT JOIN food_donations fd ON o.org_id = fd.donor_id
LEFT JOIN food_requests fr ON o.org_id = fr.requestor_id
LEFT JOIN pickups p ON o.org_id = p.volunteer_id
LEFT JOIN notifications n ON u.user_id = n.user_id
GROUP BY u.user_id, u.full_name, u.role, u.last_login
HAVING COUNT(DISTINCT fd.donation_id) > 0 OR COUNT(DISTINCT fr.request_id) > 0
ORDER BY engagement_level DESC, u.full_name;

-- Emergency food distribution analysis
SELECT
    DATE(fd.pickup_date) AS distribution_date,
    COUNT(DISTINCT fd.donation_id) AS donations_distributed,
    SUM(fd.available_quantity) AS total_quantity_distributed,
    COUNT(DISTINCT fr.request_id) AS requests_fulfilled,
    COUNT(DISTINCT p.pickup_id) AS pickups_completed,
    COUNT(DISTINCT p.volunteer_id) AS volunteers_involved,
    AVG(fi.safety_rating) AS average_safety_rating,
    CASE
        WHEN COUNT(DISTINCT fd.donation_id) > 50 THEN 'HIGH_VOLUME'
        WHEN COUNT(DISTINCT fd.donation_id) > 20 THEN 'MEDIUM_VOLUME'
        ELSE 'LOW_VOLUME'
    END AS distribution_volume
FROM food_donations fd
JOIN pickups p ON fd.donation_id = p.donation_id
JOIN food_items fi ON fd.food_item_id = fi.item_id
LEFT JOIN allocations a ON fd.donation_id = a.donation_id
LEFT JOIN food_requests fr ON a.request_id = fr.request_id
WHERE p.status = 'COMPLETED'
  AND fd.status = 'COMPLETED'
GROUP BY DATE(fd.pickup_date)
ORDER BY distribution_date DESC;

-- ==============================================================================
   MAINTENANCE AND MONITORING
   -- ==============================================================================

-- Check for orphaned records
SELECT
    'Orphaned FoodDonations' as issue_type,
    COUNT(*) as orphaned_count
FROM food_donations fd
LEFT JOIN food_items fi ON fd.food_item_id = fi.item_id
LEFT JOIN organizations o ON fd.donor_id = o.org_id
WHERE fi.item_id IS NULL OR o.org_id IS NULL

UNION ALL

SELECT
    'Orphaned FoodItems' as issue_type,
    COUNT(*) as orphaned_count
FROM food_items fi
LEFT JOIN food_categories fc ON fi.category_id = fc.category_id
LEFT JOIN organizations o ON fi.donor_id = o.org_id
WHERE fc.category_id IS NULL OR o.org_id IS NULL

UNION ALL

SELECT
    'Orphaned FoodRequests' as issue_type,
    COUNT(*) as orphaned_count
FROM food_requests fr
LEFT JOIN organizations o ON fr.requestor_id = o.org_id
LEFT JOIN food_categories fc ON fr.category_id = fc.category_id
WHERE o.org_id IS NULL OR fc.category_id IS NULL

UNION ALL

SELECT
    'Orphaned Allocations' as issue_type,
    COUNT(*) as orphaned_count
FROM allocations a
LEFT JOIN food_donations fd ON a.donation_id = fd.donation_id
LEFT JOIN food_requests fr ON a.request_id = fr.request_id
WHERE fd.donation_id IS NULL OR fr.request_id IS NULL

UNION ALL

SELECT
    'Orphaned Pickups' as issue_type,
    COUNT(*) as orphaned_count
FROM pickups p
LEFT JOIN food_donations fd ON p.donation_id = fd.donation_id
LEFT JOIN organizations o ON p.volunteer_id = o.org_id
WHERE fd.donation_id IS NULL OR o.org_id IS NULL;

-- ==============================================================================
   END OF SQL_QUERIES.sql
   -- ==============================================================================