import { supabaseAdmin } from './supabase'

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await createUsersTable()
    await createFoodItemsTable()
    await createRecipientsTable()
    await createMatchesTable()
    await createPickupsTable()
    await createNotificationsTable()
    await createSecurityPolicies()

    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    throw error
  }
}

async function createUsersTable() {
  const { error } = await supabaseAdmin.rpc('create_users_table')
  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function createFoodItemsTable() {
  const { error } = await supabaseAdmin.rpc('create_food_items_table')
  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function createRecipientsTable() {
  const { error } = await supabaseAdmin.rpc('create_recipients_table')
  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function createMatchesTable() {
  const { error } = await supabaseAdmin.rpc('create_matches_table')
  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function createPickupsTable() {
  const { error } = await supabaseAdmin.rpc('create_pickups_table')
  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function createNotificationsTable() {
  const { error } = await supabaseAdmin.rpc('create_notifications_table')
  if (error && !error.message.includes('already exists')) {
    throw error
  }
}

async function createSecurityPolicies() {
  // Row Level Security policies will be created via migrations or SQL scripts
  console.log('💡 Note: Please run SQL migrations for RLS policies')
}