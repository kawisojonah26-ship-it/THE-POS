const STORAGE_KEY = 'business-pos-pro-v1';
const DELIVERY_STATUSES = ['Pending', 'Preparing', 'Ready for Delivery', 'Dispatched', 'On the Way', 'Arrived', 'Received', 'Delivered', 'Cancelled', 'Failed'];
const DELIVERY_FAILURE_REASONS = ['Customer unavailable', 'Wrong address', 'Customer cancelled', 'Other'];

const defaultState = {
  localSummary: null,
  session: {
    loggedIn: false,
    userId: null
  },
  business: {
    name: 'SUUK POS',
    phone: '0700000000',
    email: '',
    address: 'Kampala, Uganda',
    logo: '',
    country: 'Uganda',
    currency: 'UGX',
    taxRate: 0,
    multiBranches: false,
    openingBalance: 0,
    financialYearStart: '2026-01-01'
  },
  preferences: {
    darkMode: false,
    receiptPaperSize: 'thermal',
    currentBranchId: ''
  },
  branches: [],
  mobileMoneyAccounts: [],
  stockTransfers: [],
  users: [
    { id: 'user-admin', username: 'admin', password: 'admin123', displayName: 'Admin', role: 'admin', phone: '', email: '', address: '' },
    { id: 'user-sales', username: 'sales', password: 'sales123', displayName: 'Sales', role: 'sales', phone: '', email: '', address: '' },
    { id: 'user-purchase', username: 'purchase', password: 'purchase123', displayName: 'Purchase & Inventory', role: 'purchase', phone: '', email: '', address: '' },
    { id: 'user-delivery', username: 'delivery', password: 'delivery123', displayName: 'Delivery Staff', role: 'delivery', phone: '', email: '', address: '' }
  ],
  products: [
    { id: 'prod-1', name: 'Coke 500ml', category: 'Beverages', sku: 'COKE500', barcode: 'COKE500', buyingPrice: 1200, sellingPrice: 2000, stock: 50, lowStockThreshold: 10, expiryDate: '' },
    { id: 'prod-2', name: 'Bread', category: 'Bakery', sku: 'BREAD', barcode: 'BREAD', buyingPrice: 1800, sellingPrice: 3500, stock: 12, lowStockThreshold: 5, expiryDate: '' },
    { id: 'prod-3', name: 'Sugar 1kg', category: 'Groceries', sku: 'SUGAR1', barcode: 'SUGAR1', buyingPrice: 2600, sellingPrice: 5000, stock: 4, lowStockThreshold: 5, expiryDate: '' },
    { id: 'prod-4', name: 'Samsung TV 32"', category: 'Electronics', sku: 'TV32', barcode: 'TV32', buyingPrice: 620000, sellingPrice: 850000, stock: 7, lowStockThreshold: 2, expiryDate: '' },
    { id: 'prod-5', name: 'Men Shirt', category: 'Fashion', sku: 'SHIRT', barcode: 'SHIRT', buyingPrice: 12000, sellingPrice: 30000, stock: 15, lowStockThreshold: 5, expiryDate: '' }
  ],
  customers: [
    { id: 'cust-1', name: 'Walk-in Customer', phone: '', type: 'Physical', balance: 0, totalPurchases: 0 },
    { id: 'cust-2', name: 'John', phone: '0701234567', type: 'Delivery', balance: 50000, totalPurchases: 450000 }
  ],
  vendors: [
    { id: 'vend-1', name: 'ABC Distributors', phone: '0709876543', amountOwed: 300000 },
    { id: 'vend-2', name: 'Fresh Foods Ltd', phone: '0776543210', amountOwed: 0 }
  ],
  sales: [
    {
      id: 'sale-1',
      createdAt: '2026-09-15T09:15:00',
      customerId: 'cust-1',
      customerName: 'Walk-in Customer',
      customerType: 'Physical',
      cashierId: 'user-admin',
      cashierName: 'Admin',
      items: [
        { productId: 'prod-5', name: 'Men Shirt', qty: 2, price: 30000, total: 60000 }
      ],
      subtotal: 60000,
      discount: 0,
      total: 60000,
      paymentMethod: 'Mobile Money',
      status: 'Completed',
      receiptNo: 'POS-1001'
    }
  ],
  purchases: [
    {
      id: 'pur-1',
      createdAt: '2026-09-15T08:00:00',
      vendorId: 'vend-2',
      vendorName: 'Fresh Foods Ltd',
      actorId: 'user-admin',
      actorName: 'Admin',
      items: [
        { productId: 'prod-1', name: 'Coke 500ml', qty: 20, buyingPrice: 1200, total: 24000 }
      ],
      total: 24000
    }
  ],
  quotations: [],
  vendorInvoices: [],
  expenses: [
    { id: 'exp-1', name: 'Electricity', amount: 100000, date: '2026-09-15', description: 'Monthly office power bill' },
    { id: 'exp-2', name: 'Transport', amount: 50000, date: '2026-09-15', description: 'Delivery transport' }
  ],
  payments: [
    { id: 'pay-1', type: 'Income', label: 'Customer payment', amount: 250000, date: '2026-09-15' },
    { id: 'pay-2', type: 'Expense', label: 'Rent', amount: 300000, date: '2026-09-15' }
  ],
  creditAccounts: [],
  deliveries: [
    { id: 'del-1', customerName: 'John', address: 'Kampala, Nakawa', phone: '0701234567', fee: 15000, status: 'Pending' },
    { id: 'del-2', customerName: 'Mary', address: 'Mbarara Road', phone: '0771234567', fee: 12000, status: 'Delivered' }
  ]
};

const state = loadState();
saveState();
const saleDraft = {
  items: [],
  customerId: '',
  paymentMethod: 'Cash',
  discount: 0,
  taxRate: 0,
  paymentDetails: {}
};
const purchaseDraft = { items: [], vendorId: '' };
const quotationDraft = { items: [], editingId: '' };
const invoiceDraft = { items: [], editingId: '' };

const navButtons = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const sections = document.querySelectorAll('.module-section');
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const stockPill = document.getElementById('stock-pill');
const lowStockPill = document.getElementById('low-stock-pill');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const dashboard = document.getElementById('dashboard');

const salesCustomerSelect = document.getElementById('sales-customer');
const salesCashierSelect = document.getElementById('sales-cashier');
const salesPaymentMethod = document.getElementById('sales-payment-method');
const mobileMoneyDetails = document.getElementById('mobile-money-details');
const creditPaymentDetails = document.getElementById('credit-payment-details');
const otherPaymentDetails = document.getElementById('other-payment-details');
const mobileMoneyAccountSelect = document.getElementById('mobile-money-account');
const creditAccountsListBox = document.getElementById('credit-accounts-list');
const salesProductSelect = document.getElementById('sales-product');
const salesProductSearch = document.getElementById('sales-product-search');
const salesProductOptions = document.getElementById('sales-product-options');
const salesQtyInput = document.getElementById('sales-qty');
const salesDiscountInput = document.getElementById('sales-discount');
const salesCartBox = document.getElementById('sales-cart');
const salesSubtotal = document.getElementById('sales-subtotal');
const salesDiscountTotal = document.getElementById('sales-discount-total');
const salesGrandTotal = document.getElementById('sales-grand-total');
const salesHistoryBox = document.getElementById('sales-history');
const salesHistorySearch = document.getElementById('sales-history-search');
const receiptPreview = document.getElementById('receipt-preview');
const salesBarcodeInput = document.getElementById('sales-barcode');
const purchaseBarcodeInput = document.getElementById('purchase-barcode');
const purchaseProductSearch = document.getElementById('purchase-product-search');
const purchaseProductOptions = document.getElementById('purchase-product-options');
const themeToggle = document.getElementById('theme-toggle');
const receiptPaperSize = document.getElementById('receipt-paper-size');

const purchaseVendorSelect = document.getElementById('purchase-vendor');
const purchaseProductSelect = document.getElementById('purchase-product');
const purchaseQtyInput = document.getElementById('purchase-qty');
const purchasePriceInput = document.getElementById('purchase-price');
const purchaseSellingPriceInput = document.getElementById('purchase-selling-price');
const purchaseExpiryDateInput = document.getElementById('purchase-expiry-date');
const purchaseCartBox = document.getElementById('purchase-cart');
const purchaseGrandTotal = document.getElementById('purchase-grand-total');
const purchaseHistoryBox = document.getElementById('purchase-history');
const purchaseHistorySearch = document.getElementById('purchase-history-search');
const quotationForm = document.getElementById('quotation-form');
const quotationCustomerSelect = document.getElementById('quotation-customer');
const quotationProductSelect = document.getElementById('quotation-product');
const quotationCartBox = document.getElementById('quotation-cart');
const quotationListBox = document.getElementById('quotation-list');
const quotationSearch = document.getElementById('quotation-search');
const invoiceForm = document.getElementById('vendor-invoice-form');
const invoiceVendorSelect = document.getElementById('invoice-vendor');
const invoiceProductSelect = document.getElementById('invoice-product');
const invoiceCartBox = document.getElementById('invoice-cart');
const invoiceListBox = document.getElementById('invoice-list');
const invoiceSearch = document.getElementById('invoice-search');
const vendorPaymentModal = document.getElementById('vendor-payment-modal');
const vendorPaymentForm = document.getElementById('vendor-payment-form');
let vendorPaymentInvoiceId = '';
const currentBranchSelect = document.getElementById('current-branch');
const branchForm = document.getElementById('branch-form');
const branchListBox = document.getElementById('branch-list');
const branchManagerSelect = document.getElementById('branch-manager');
const stockTransferForm = document.getElementById('stock-transfer-form');
const stockTransferList = document.getElementById('stock-transfer-list');

const customerForm = document.getElementById('customer-form');
const customerSearch = document.getElementById('customer-search');
const creditSearch = document.getElementById('credit-search');
const customerListBox = document.getElementById('customer-list');
const businessSettingsForm = document.getElementById('business-settings-form');
const businessLogoInput = document.getElementById('business-logo');
const businessLogoPreview = document.getElementById('business-logo-preview');
const staffAccountForm = document.getElementById('staff-account-form');
const staffAccountList = document.getElementById('staff-account-list');

const vendorForm = document.getElementById('vendor-form');
const vendorSearch = document.getElementById('vendor-search');
const vendorListBox = document.getElementById('vendor-list');

const productForm = document.getElementById('product-form');
const lowStockListBox = document.getElementById('low-stock-list');
const productListBox = document.getElementById('product-list');
const productSearch = document.getElementById('product-search');

const expenseForm = document.getElementById('expense-form');
const paymentForm = document.getElementById('payment-form');
const expenseHistoryBox = document.getElementById('expense-history');
const expenseSearch = document.getElementById('expense-search');
const staffSearch = document.getElementById('staff-search');
const branchSearch = document.getElementById('branch-search');
const mobileMoneyAccountForm = document.getElementById('mobile-money-account-form');
const mobileMoneyAccountList = document.getElementById('mobile-money-account-list');
const mobileMoneyAccountBranch = document.getElementById('mobile-money-account-branch');
const todayIncome = document.getElementById('today-income');
const todayExpenses = document.getElementById('today-expenses');
const todayProfit = document.getElementById('today-profit');
const currentBalance = document.getElementById('current-balance');
const reportType = document.getElementById('report-type');
const reportFrom = document.getElementById('report-from');
const reportTo = document.getElementById('report-to');
const reportResults = document.getElementById('report-results');
const reportSummary = document.getElementById('report-summary');

const deliveryListBox = document.getElementById('delivery-list');
const deliverySummary = document.getElementById('delivery-summary');
const deliveryBoardCount = document.getElementById('delivery-board-count');
const deliveryFilterDate = document.getElementById('delivery-filter-date');
const deliveryFilterStatus = document.getElementById('delivery-filter-status');
const deliveryFilterDriver = document.getElementById('delivery-filter-driver');
const deliveryFilterCustomer = document.getElementById('delivery-filter-customer');
const deliveryModal = document.getElementById('delivery-modal');
const deliveryModalForm = document.getElementById('delivery-modal-form');
const deliveryModalTitle = document.getElementById('delivery-modal-title');
const deliveryModalFields = document.getElementById('delivery-modal-fields');
const deliveryModalSubmit = document.getElementById('delivery-modal-submit');
let deliveryModalAction = '';
let deliveryModalDeliveryId = '';
let returnSaleId = '';
const returnSaleModal = document.getElementById('return-sale-modal');
const historyYearSelect = document.getElementById('history-year');
const historyMonthSelect = document.getElementById('history-month');
const historyCalendar = document.getElementById('history-calendar');
const historySelectedTitle = document.getElementById('history-selected-title');
const historySelectedTotal = document.getElementById('history-selected-total');
const historySelectedList = document.getElementById('history-selected-list');

const historyView = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate()
};

const liveStockBadge = document.getElementById('live-stock-badge');
const lowStockBadge = document.getElementById('low-stock-badge');

let lastReceiptText = 'No sale completed yet.';

setup();
function setup() {
  bindNavigation();
  bindDashboardNavigation();
  bindSalesActions();
  bindPurchaseActions();
  bindQuotationActions();
  bindVendorInvoiceActions();
  bindBranchActions();
  bindCustomerActions();
  bindVendorActions();
  bindInventoryActions();
  bindAccountActions();
  bindDeliveryActions();
  bindHistoryActions();
  bindAdminSettingsActions();
  bindDisplayPreferences();
  bindAuthActions();
  renderAll();
  applyAuthState();
}

function loadState() {
  const freshState = JSON.parse(JSON.stringify(defaultState));
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return freshState;

  try {
    const parsed = JSON.parse(saved);
    const users = parsed.users || freshState.users;
    if (!users.some((user) => user.role === 'delivery')) users.push(freshState.users.find((user) => user.role === 'delivery'));
    return {
      ...freshState,
      ...parsed,
      session: {
        ...freshState.session,
        ...(parsed.session || {})
      },
      business: {
        ...freshState.business,
        ...(parsed.business || {})
      },
      preferences: {
        ...freshState.preferences,
        ...(parsed.preferences || {})
      },
      branches: parsed.branches || freshState.branches,
      mobileMoneyAccounts: (parsed.mobileMoneyAccounts || freshState.mobileMoneyAccounts).map((account) => ({
        ...account,
        network: account.network === 'Airtel' ? 'Airtel' : 'MTN',
        status: account.status === 'Inactive' ? 'Inactive' : 'Active',
        branchId: account.branchId || ''
      })),
      stockTransfers: parsed.stockTransfers || freshState.stockTransfers,
      users,
      products: (parsed.products || freshState.products).map((product) => ({
        ...product,
        barcode: product.barcode || product.sku || '',
        branchId: product.branchId || '',
        expiryDate: product.expiryDate || ''
      })),
      customers: (parsed.customers || freshState.customers).map((customer) => {
        const type = customer.type === 'Call Order' ? 'Delivery' : customer.type === 'Physical' ? 'Physical' : 'Delivery';
        return {
          ...customer,
          name: type === 'Physical' ? 'Walk-in Customer' : customer.name,
          type
        };
      }),
      vendors: parsed.vendors || freshState.vendors,
      sales: parsed.sales || freshState.sales,
      purchases: parsed.purchases || freshState.purchases,
      quotations: parsed.quotations || freshState.quotations,
      vendorInvoices: parsed.vendorInvoices || freshState.vendorInvoices,
      expenses: parsed.expenses || freshState.expenses,
      payments: parsed.payments || freshState.payments,
      creditAccounts: parsed.creditAccounts || freshState.creditAccounts,
      deliveries: (parsed.deliveries || freshState.deliveries).map(normalizeDelivery)
    };
  } catch (error) {
    return freshState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...state,
    session: state.session,
    localSummary: null,
    users: state.users.map((user) => ({ ...user }))
  }));
}

async function localRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  let body = {};
  try { body = options.body ? JSON.parse(options.body) : {}; } catch (_) { body = {}; }
  const cleanPath = path.split('?')[0];
  const id = cleanPath.split('/')[2] || '';
  const now = new Date().toISOString();
  const makeId = (prefix) => uid(prefix);

  // Browser-only replacement for the former network API. Nothing is sent over the network.
  if (method === 'GET') {
    if (cleanPath === '/products') return { products: state.products.map((p) => ({ id:p.id, name:p.name, category:p.category, sku:p.sku, barcode:p.barcode, cost_price:p.buyingPrice, selling_price:p.sellingPrice, stock:p.stock, minimum_stock:p.lowStockThreshold, expiry_date:p.expiryDate })) };
    if (cleanPath === '/customers') return { customers: state.customers.map((c) => ({ ...c, active:true })) };
    if (cleanPath === '/suppliers') return { suppliers: state.vendors.map((v) => ({ id:v.id, name:v.name, phone:v.phone, amount_owed:v.amountOwed, active:true })) };
    if (cleanPath === '/sales') return { sales: state.sales.map((s) => s) };
    if (cleanPath === '/purchases') return { purchases: state.purchases.map((p) => p) };
    if (cleanPath === '/expenses') return { expenses: state.expenses.map((e) => e) };
    if (cleanPath === '/payments') return { payments: state.payments.map((p) => p) };
    if (cleanPath === '/branches') return { branches: state.branches };
    if (cleanPath === '/mobile-money/accounts') return { accounts: state.mobileMoneyAccounts.map((a) => ({ id:a.id, network:a.network, recipient_name:a.name, phone:a.phone, description:a.description, active:a.status !== 'Inactive', branch_id:a.branchId || null })) };
    if (cleanPath === '/quotations') return { quotations: state.quotations };
    if (cleanPath === '/vendor-invoices') return { vendor_invoices: state.vendorInvoices };
    if (cleanPath === '/deliveries') return { deliveries: state.deliveries };
    if (cleanPath === '/stock-transfers') return { stock_transfers: state.stockTransfers };
    if (cleanPath === '/users') return { users: state.users.map(mapUser) };
    if (cleanPath === '/business') return { business: { id:'business-local', name:state.business.name, phone:state.business.phone, email:state.business.email, address:state.business.address, logo:state.business.logo, country:state.business.country, currency:state.business.currency, tax_rate:state.business.taxRate, multi_branch:state.business.multiBranches, opening_balance:state.business.openingBalance, financial_year_start:state.business.financialYearStart } };
    if (cleanPath === '/reports/summary') return { summary: buildLocalSummary() };
    return {};
  }

  const parsed = cleanPath.split('/').filter(Boolean);
  const resource = parsed[0] || '';

  if (resource === 'sales' && method === 'POST') {
    const sale = { id: makeId('sale'), created_at: now, ...body };
    return { sale };
  }
  if (resource === 'purchases' && method === 'POST') {
    const purchase = { id: makeId('pur'), created_at: now, ...body };
    return { purchase };
  }
  if (resource === 'quotations') {
    if (parsed[1] && parsed[2] === 'status' && method === 'PATCH') {
      const q = state.quotations.find((x) => x.id === parsed[1]); if (q) q.status = body.status;
      saveState(); return { quotation:q };
    }
    const existing = parsed[1] ? state.quotations.find((x) => x.id === parsed[1]) : null;
    const quotation = { id: existing?.id || makeId('quote'), quotation_no: body.quotation_no || existing?.quotationNo || `QT-${Date.now().toString().slice(-7)}`, ...body, created_at: existing?.created_at || now, status: existing?.status || 'Draft' };
    const mapped = mapQuotation(quotation);
    if (existing) Object.assign(existing, mapped); else state.quotations.unshift(mapped);
    saveState();
    return { quotation };
  }
  if (resource === 'vendor-invoices') {
    if (parsed[1] && parsed[2] === 'payments' && method === 'POST') {
      const inv = state.vendorInvoices.find((x) => x.id === parsed[1]);
      if (inv) inv.amountPaid = Number(inv.amountPaid || 0) + Number(body.amount || 0);
      saveState(); return { invoice: inv };
    }
    const existing = parsed[1] ? state.vendorInvoices.find((x) => x.id === parsed[1]) : null;
    const invoice = { id: existing?.id || makeId('inv'), invoice_no: body.invoice_no || existing?.invoiceNo || '', supplier_id: body.supplier_id || existing?.vendorId || '', supplier_name: body.supplier_name || existing?.vendorName || '', ...body, created_at: existing?.created_at || now, amount_paid: existing?.amountPaid || 0, payment_status: existing?.status || 'Unpaid', received: !!body.received };
    const mapped = mapVendorInvoice(invoice);
    if (existing) Object.assign(existing, mapped); else state.vendorInvoices.unshift(mapped);
    saveState();
    return { vendor_invoice: invoice };
  }
  if (resource === 'customers') {
    if (method === 'DELETE') return {};
    const existing = state.customers.find((x) => x.id === id);
    return { customer: { id: existing?.id || makeId('cust'), ...body } };
  }
  if (resource === 'suppliers') {
    if (method === 'DELETE') return {};
    const existing = state.vendors.find((x) => x.id === id);
    return { supplier: { id: existing?.id || makeId('vend'), name: body.name || existing?.name || '', phone: body.phone || existing?.phone || '', amount_owed: existing?.amountOwed || 0, active:true } };
  }
  if (resource === 'products') {
    if (method === 'DELETE') return {};
    const existing = state.products.find((x) => x.id === id);
    const product = { id: existing?.id || makeId('prod'), name: body.name || existing?.name || '', category: body.category || existing?.category || '', sku: body.sku || existing?.sku || '', barcode: body.barcode || existing?.barcode || '', buyingPrice: Number(body.cost_price ?? existing?.buyingPrice ?? 0), sellingPrice: Number(body.selling_price ?? existing?.sellingPrice ?? 0), stock: Number(body.stock ?? existing?.stock ?? 0), lowStockThreshold: Number(body.minimum_stock ?? existing?.lowStockThreshold ?? 0), expiryDate: body.expiry_date || existing?.expiryDate || '', branchId: body.branch_id || existing?.branchId || '' };
    if (existing) Object.assign(existing, product); else state.products.push(product);
    saveState();
    return { product: { id:product.id, name:product.name, category:product.category, sku:product.sku, barcode:product.barcode, cost_price:product.buyingPrice, selling_price:product.sellingPrice, stock:product.stock, minimum_stock:product.lowStockThreshold, expiry_date:product.expiryDate } };
  }
  if (resource === 'users') {
    if (method === 'DELETE') return {};
    const existing = state.users.find((x) => x.id === id);
    return { user: { id: existing?.id || makeId('user'), username: body.username || existing?.username || '', display_name: body.display_name || existing?.displayName || '', role: body.role || existing?.role || 'sales', phone: body.phone || existing?.phone || '', email: body.email || existing?.email || '', address: body.address || existing?.address || '', branch_id: body.branch_id || existing?.branchId || '', active:true } };
  }
  if (resource === 'branches') {
    if (method === 'DELETE') return {};
    const existing = state.branches.find((x) => x.id === id);
    return { branch: { id: existing?.id || makeId('branch'), name: body.name || existing?.name || '', phone: body.phone || existing?.phone || '', address: body.address || existing?.address || '', active: body.active !== false } };
  }
  if (resource === 'mobile-money' && parsed[1] === 'accounts') {
    if (method === 'DELETE') return {};
    const existing = state.mobileMoneyAccounts.find((x) => x.id === id);
    return { account: { id: existing?.id || makeId('mm'), network: body.network || existing?.network || 'MTN', recipient_name: body.recipient_name || existing?.name || '', phone: body.phone || existing?.phone || '', description: body.description || existing?.description || '', active: body.active !== false, branch_id: body.branch_id || existing?.branchId || '' } };
  }
  if (resource === 'expenses' && method === 'POST') return { expense: { id:makeId('exp'), ...body } };
  if (resource === 'payments' && method === 'POST') return { payment: { id:makeId('pay'), ...body, date:dateISO() } };
  if (resource === 'deliveries') {
    const existing = state.deliveries.find((x) => x.id === id);
    const normalized = { ...(existing || {}), id: existing?.id || makeId('del') };
    if (body.driver_id !== undefined) normalized.driverId = body.driver_id;
    if (body.status !== undefined) normalized.status = body.status;
    if (body.failure_reason !== undefined) normalized.failureReason = body.failure_reason;
    if (body.failure_description !== undefined) normalized.failureDescription = body.failure_description;
    if (body.timestamp_key) normalized.timestamps = { ...(normalized.timestamps || {}), [body.timestamp_key]: now };
    if (existing) Object.assign(existing, normalized); else state.deliveries.push(normalized);
    saveState();
    return { delivery: { id: normalized.id, business_id: normalized.businessId || '', branch_id: normalized.branchId || '', sale_id: normalized.saleId || '', delivery_no: normalized.deliveryNo || '', receipt_no: normalized.receiptNo || '', customer_id: normalized.customerId || '', customer_name: normalized.customerName || '', customer_email: normalized.customerEmail || '', phone: normalized.phone || '', address: normalized.address || '', order_total: normalized.orderTotal || 0, fee: normalized.fee || 0, status: normalized.status, driver_id: normalized.driverId || '', driver_name: normalized.driverName || '', pin: normalized.pin || '', failure_reason: normalized.failureReason || '', failure_description: normalized.failureDescription || '', timestamps: normalized.timestamps || {}, created_at: normalized.createdAt || now } };
  }
  if (resource === 'stock-transfers' && method === 'POST') return { transfer: { id:makeId('transfer'), ...body, status:'Completed', created_at:now } };
  if (resource === 'business' && method === 'PATCH') return { business: { ...body, id:'business-local' } };
  if (resource === 'sales' && parsed[2] === 'return') return {};
  return {};
}

function localLogin(username, password) {
  const user = state.users.find((entry) => entry.username.toLowerCase() === username.toLowerCase() && entry.password === password && entry.active !== false);
  if (!user) throw new Error('Invalid username or password.');
  return user;
}

function buildLocalSummary() {
  const revenue = state.sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const expenses = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0) + state.purchases.reduce((sum, item) => sum + Number(item.total || 0), 0);
  return { totalRevenue: revenue, totalExpenses: expenses, netProfit: revenue - expenses };
}

function mapProduct(product) {
  return { id: product.id, name: product.name, category: product.category || '', sku: product.sku || '', barcode: product.barcode || '', buyingPrice: Number(product.cost_price || 0), sellingPrice: Number(product.selling_price || 0), stock: Number(product.stock || 0), lowStockThreshold: Number(product.minimum_stock || 0), expiryDate: '' };
}

function mapCustomer(customer) {
  return { id: customer.id, name: customer.name, phone: customer.phone || '', email: customer.email || '', address: customer.address || '', type: customer.name === 'Walk-in Customer' ? 'Physical' : 'Delivery', balance: Number(customer.balance || 0), totalPurchases: 0, active: customer.active !== false };
}

function mapVendor(vendor) {
  return { id: vendor.id, name: vendor.name, phone: vendor.phone || '', email: vendor.email || '', address: vendor.address || '', amountOwed: Number(vendor.balance || 0), active: vendor.active !== false };
}

function mapSale(sale) {
  return { id: sale.id, createdAt: sale.created_at, customerId: sale.customer_id || '', customerName: sale.customer_name || '', cashierId: sale.cashier_id, cashierName: sale.cashier_name || '', items: sale.items || [], subtotal: Number(sale.subtotal), discount: Number(sale.discount), tax: Number(sale.tax), total: Number(sale.total), paymentMethod: 'Cash', status: sale.status === 'completed' ? 'Completed' : sale.status, receiptNo: sale.receipt_no, branchId: sale.branch_id || '' };
}

function mapPurchase(purchase) {
  return { id: purchase.id, createdAt: purchase.created_at, vendorId: purchase.supplier_id || '', vendorName: purchase.supplier_name || '', actorId: purchase.created_by, actorName: '', items: purchase.items || [], total: Number(purchase.total), branchId: purchase.branch_id || '' };
}

function mapExpense(expense) {
  return { id: expense.id, name: expense.name, amount: Number(expense.amount), date: String(expense.expense_date || '').slice(0, 10), description: expense.description || '', branchId: expense.branch_id || '' };
}

function mapPayment(payment) {
  return { id: payment.id, type: payment.sale_id ? 'Income' : 'Expense', label: payment.method, amount: Number(payment.amount), date: payment.created_at?.slice(0, 10) || dateISO(), branchId: payment.branch_id || '' };
}

function mapQuotation(quotation) {
  return { id: quotation.id, businessId: quotation.business_id, branchId: quotation.branch_id || '', quotationNo: quotation.quotation_no, customerId: quotation.customer_id, customerName: quotation.customer_name, items: quotation.items || [], quotationDate: String(quotation.quotation_date || '').slice(0, 10), expiryDate: String(quotation.expiry_date || '').slice(0, 10), notes: quotation.notes || '', taxRate: Number(quotation.tax_rate || 0), subtotal: Number(quotation.subtotal), discount: Number(quotation.discount), tax: Number(quotation.tax), total: Number(quotation.total), status: quotation.status, createdAt: quotation.created_at, convertedSaleId: quotation.converted_sale_id || '' };
}

function mapVendorInvoice(invoice) {
  return { id: invoice.id, businessId: invoice.business_id, branchId: invoice.branch_id || '', invoiceNo: invoice.invoice_no, vendorId: invoice.supplier_id, vendorName: invoice.vendor_name, invoiceDate: String(invoice.invoice_date || '').slice(0, 10), dueDate: String(invoice.due_date || '').slice(0, 10), items: invoice.items || [], subtotal: Number(invoice.subtotal), discount: Number(invoice.discount), tax: Number(invoice.tax), total: Number(invoice.total), amountPaid: Number(invoice.amount_paid), status: invoice.payment_status, received: invoice.received, stockApplied: invoice.received, createdAt: invoice.created_at };
}

function mapDelivery(delivery) {
  return normalizeDelivery({ id: delivery.id, businessId: delivery.business_id, branchId: delivery.branch_id || '', saleId: delivery.sale_id || '', purchaseId: delivery.purchase_id || '', deliveryNo: delivery.delivery_no, receiptNo: delivery.receipt_no || '', customerId: delivery.customer_id || '', customerName: delivery.customer_name, customerEmail: delivery.customer_email || '', phone: delivery.phone || '', address: delivery.address || '', orderTotal: Number(delivery.order_total || 0), fee: Number(delivery.fee || 0), status: delivery.status, driverId: delivery.driver_id || '', driverName: delivery.driver_name || '', pin: delivery.pin, failureReason: delivery.failure_reason || '', failureDescription: delivery.failure_description || '', timestamps: delivery.timestamps || {}, createdAt: delivery.created_at });
}

function mapUser(user) {
  return { id: user.id, businessId: user.business_id, branchId: user.branch_id || '', username: user.username, displayName: user.display_name, role: user.role, email: user.email || '', phone: user.phone || '', address: user.address || '', active: user.active !== false };
}

function mapBusiness(business) {
  return { id: business.id, name: business.name, phone: business.phone || '', email: business.email || '', address: business.address || '', logo: business.logo || '', country: business.country || '', currency: business.currency || 'UGX', taxRate: Number(business.tax_rate || 0), multiBranches: !!business.multi_branch, openingBalance: Number(business.opening_balance || 0), financialYearStart: String(business.financial_year_start || '').slice(0, 10) };
}

function mapTransfer(transfer) {
  const item = transfer.items?.[0] || {};
  return { id: transfer.id, fromBranchId: transfer.from_branch_id, toBranchId: transfer.to_branch_id, productId: item.productId, quantity: Number(item.quantity || 0), status: transfer.status, createdAt: transfer.created_at };
}

async function refreshLocalState() {
  // GitHub Pages version: application state lives in browser localStorage.
  saveState();
  return state;
}

async function refreshLocalSummary() {
  state.localSummary = buildLocalSummary();
  return state.localSummary;
}

function bindNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showSection(button.dataset.section, button.textContent.trim(), button);
    });
  });

  stockPill.addEventListener('click', () => showSection('inventory', '📊 Inventory'));
  lowStockPill.addEventListener('click', () => showSection('inventory', '📊 Inventory'));

  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    sidebarBackdrop.classList.toggle('visible', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  sidebarBackdrop.addEventListener('click', closeMobileMenu);
}

function bindDashboardNavigation() {
  const openDashboardSection = (section) => {
    const navigationItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (!navigationItem || navigationItem.hidden) return;
    showSection(section, navigationItem.textContent.trim(), navigationItem);
  };

  dashboard.addEventListener('click', (event) => {
    const target = event.target.closest('[data-dashboard-section]');
    if (target) openDashboardSection(target.dataset.dashboardSection);
  });

  dashboard.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const target = event.target.closest('[data-dashboard-section]');
    if (!target) return;
    event.preventDefault();
    openDashboardSection(target.dataset.dashboardSection);
  });
}

function showSection(target, title, activeButton = null) {
  pageTitle.textContent = title;
  sections.forEach((section) => section.classList.toggle('active', section.id === target));
  navButtons.forEach((item) => item.classList.toggle('active', item === activeButton || item.dataset.section === target));
  closeMobileMenu();
}

function closeMobileMenu() {
  sidebar.classList.remove('open');
  sidebarBackdrop.classList.remove('visible');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function bindAuthActions() {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    try {
      const user = localLogin(username, password);
      if (!state.users.some((entry) => entry.id === user.id)) state.users = [mapUser(user)];
      state.session.loggedIn = true;
      state.session.userId = user.id;
      applyAuthState();
    } catch (error) {
      alert(error.message || 'Unable to sign in. ');
    }
  });

  logoutButton.addEventListener('click', () => {
    state.session.loggedIn = false;
    state.session.userId = null;
    saveState();
    applyAuthState();
  });
}

function applyAuthState() {
  const isLoggedIn = !!(state.session && state.session.loggedIn);
  loginOverlay.classList.toggle('hidden', isLoggedIn);
  document.getElementById('app-shell').style.filter = isLoggedIn ? 'none' : 'blur(2px)';
  if (!isLoggedIn) {
    document.getElementById('login-password').value = 'admin123';
  }
  applyRolePermissions();
  renderAll();
}

function getCurrentUser() {
  return state.users.find((user) => user.id === state.session?.userId) || state.users[0];
}

function hasRole(...roles) {
  return roles.includes(getCurrentUser()?.role);
}

function applyRolePermissions() {
  const user = getCurrentUser();
  const role = user?.role || 'admin';
  const allowedSections = {
    admin: ['dashboard', 'sales', 'quotations', 'purchases', 'vendor-invoices', 'customers', 'vendors', 'inventory', 'accounts', 'delivery', 'history', 'branches'],
    owner: ['dashboard', 'sales', 'quotations', 'purchases', 'vendor-invoices', 'customers', 'vendors', 'inventory', 'accounts', 'delivery', 'history', 'branches'],
    sales: ['dashboard', 'sales', 'quotations', 'inventory', 'delivery', 'history'],
    purchase: ['dashboard', 'purchases', 'vendor-invoices', 'inventory', 'delivery', 'history'],
    delivery: ['delivery']
  }[role] || ['dashboard'];

  renderCashierOptions();

  navButtons.forEach((button) => {
    button.hidden = !allowedSections.includes(button.dataset.section);
  });
  sections.forEach((section) => {
    section.hidden = !allowedSections.includes(section.id);
  });

  const salesEditor = document.querySelector('#sales .card-grid:first-child');
  if (salesEditor) salesEditor.hidden = role === 'purchase';
  const receiptPanel = document.getElementById('customer-editor-panel');
  if (receiptPanel) receiptPanel.hidden = role === 'purchase';
  if (salesCashierSelect) salesCashierSelect.disabled = !['admin', 'owner'].includes(role);
  const inventoryEditor = document.querySelector('#inventory .card-grid:first-child .panel-card:first-child');
  if (inventoryEditor) inventoryEditor.hidden = role === 'sales';
  const deliveryEditor = document.getElementById('delivery-create-panel');
  if (deliveryEditor) deliveryEditor.hidden = role === 'purchase';
  if (document.getElementById('admin-settings-panel')) {
    document.getElementById('admin-settings-panel').hidden = !['admin', 'owner'].includes(role);
  }
  applyBranchVisibility();
}

function applyBranchVisibility() {
  const isMultiBranch = !!state.business.multiBranches;
  document.querySelectorAll('.multi-branch-only').forEach((element) => {
    element.hidden = !isMultiBranch;
  });
  if (currentBranchSelect) currentBranchSelect.hidden = !isMultiBranch;
}

function getActiveBranchId() {
  return state.business.multiBranches ? state.preferences.currentBranchId || getCurrentUser()?.branchId || '' : '';
}

function getActiveBranch() {
  return state.branches.find((branch) => branch.id === getActiveBranchId()) || null;
}

function bindSalesActions() {
  document.getElementById('add-sale-item').addEventListener('click', addSaleItem);
  document.getElementById('clear-sales-draft').addEventListener('click', clearSaleDraft);
  document.getElementById('complete-sale').addEventListener('click', completeSale);
  document.getElementById('confirm-return-sale').addEventListener('click', confirmReturnSale);
  document.getElementById('cancel-return-sale').addEventListener('click', closeReturnSaleModal);
  document.getElementById('print-receipt').addEventListener('click', () => {
    if (hasRole('purchase')) return;
    printReceipt();
  });
  salesBarcodeInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const scannedValue = salesBarcodeInput.value.trim().toLowerCase();
    const product = state.products.find((entry) => [entry.barcode, entry.sku].some((code) => String(code || '').toLowerCase() === scannedValue));
    if (!product) {
      alert('Product not found. Please search for the product manually or add the barcode to the product.');
      return;
    }
    salesProductSelect.value = product.id;
    addSaleItem();
    salesBarcodeInput.value = '';
  });
  salesProductSearch.addEventListener('input', () => selectProductFromSearch(salesProductSearch, salesProductSelect));
  salesCustomerSelect.addEventListener('change', () => {
    saleDraft.customerId = salesCustomerSelect.value;
  });
  document.getElementById('sales-scan-focus').addEventListener('click', () => salesBarcodeInput.focus());
  salesPaymentMethod.addEventListener('change', () => {
    saleDraft.paymentMethod = salesPaymentMethod.value;
    renderPaymentDetails();
    renderMobileMoneyAccountOptions();
  });
  renderPaymentDetails();
  salesCashierSelect.addEventListener('change', () => {
    saleDraft.cashierId = salesCashierSelect.value;
  });
  salesDiscountInput.addEventListener('input', (event) => {
    saleDraft.discount = Number(event.target.value || 0);
    renderSalesSummary();
  });
  document.getElementById('sales-requires-delivery').addEventListener('change', (event) => {
    document.getElementById('sales-delivery-details').hidden = !event.target.checked;
    document.getElementById('sales-delivery-address-field').hidden = !event.target.checked;
    document.getElementById('sales-delivery-fee-field').hidden = !event.target.checked;
    document.getElementById('sales-delivery-customer-name').required = event.target.checked;
    document.getElementById('sales-delivery-customer-email').required = event.target.checked;
    document.getElementById('sales-delivery-email-field').hidden = !event.target.checked;
    document.getElementById('sales-delivery-address').required = event.target.checked;
  });
  salesHistorySearch.addEventListener('input', renderSalesSummary);
}

function renderPaymentDetails() {
  const method = salesPaymentMethod.value;
  mobileMoneyDetails.hidden = method !== 'Mobile Money';
  creditPaymentDetails.hidden = method !== 'Credit';
  otherPaymentDetails.hidden = !['Card', 'Bank Transfer'].includes(method);
  document.getElementById('other-payment-label').textContent = method === 'Card' ? 'Card Payment Reference' : 'Bank Transfer Reference';
  mobileMoneyAccountSelect.required = method === 'Mobile Money';
  document.getElementById('credit-customer-name').required = method === 'Credit';
  document.getElementById('credit-customer-phone').required = method === 'Credit';
  document.getElementById('credit-due-date').required = method === 'Credit';
}

function bindPurchaseActions() {
  document.getElementById('add-purchase-item').addEventListener('click', addPurchaseItem);
  document.getElementById('complete-purchase').addEventListener('click', completePurchase);
  purchaseProductSelect.addEventListener('change', () => {
    const product = state.products.find((entry) => entry.id === purchaseProductSelect.value);
    if (!product) return;
    purchaseSellingPriceInput.value = product.sellingPrice || 0;
    purchaseExpiryDateInput.value = product.expiryDate || '';
  });
  purchaseProductSearch.addEventListener('input', () => selectProductFromSearch(purchaseProductSearch, purchaseProductSelect));
  purchaseBarcodeInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const scannedValue = purchaseBarcodeInput.value.trim().toLowerCase();
    const product = findProductByBarcodeOrSku(scannedValue);
    if (!product) {
      alert('Product not found. Please search for the product manually or add the barcode to the product.');
      return;
    }
    purchaseProductSelect.value = product.id;
    purchaseProductSearch.value = product.name;
    purchaseProductSelect.dispatchEvent(new Event('change'));
    addPurchaseItem();
    purchaseBarcodeInput.value = '';
  });
  document.getElementById('purchase-scan-focus').addEventListener('click', () => purchaseBarcodeInput.focus());
  purchaseHistorySearch.addEventListener('input', renderPurchases);
}

function bindQuotationActions() {
  document.getElementById('add-quotation-item').addEventListener('click', addQuotationItem);
  document.getElementById('clear-quotation').addEventListener('click', clearQuotationDraft);
  quotationForm.addEventListener('submit', saveQuotation);
  ['quotation-discount', 'quotation-tax'].forEach((id) => document.getElementById(id).addEventListener('input', renderQuotationDraft));
  quotationProductSelect.addEventListener('change', () => {
    const product = state.products.find((entry) => entry.id === quotationProductSelect.value);
    document.getElementById('quotation-price').value = product?.sellingPrice || 0;
  });
  quotationSearch.addEventListener('input', renderQuotations);
  quotationListBox.addEventListener('click', handleQuotationAction);
}

function bindVendorInvoiceActions() {
  document.getElementById('add-invoice-item').addEventListener('click', addInvoiceItem);
  document.getElementById('clear-invoice').addEventListener('click', clearInvoiceDraft);
  invoiceForm.addEventListener('submit', saveVendorInvoice);
  ['invoice-discount', 'invoice-tax'].forEach((id) => document.getElementById(id).addEventListener('input', renderInvoiceDraft));
  invoiceProductSelect.addEventListener('change', () => {
    const product = state.products.find((entry) => entry.id === invoiceProductSelect.value);
    document.getElementById('invoice-cost').value = product?.buyingPrice || 0;
  });
  invoiceSearch.addEventListener('input', renderVendorInvoices);
  invoiceListBox.addEventListener('click', handleVendorInvoiceAction);
  vendorPaymentForm.addEventListener('submit', submitVendorInvoicePayment);
  document.getElementById('vendor-payment-cancel').addEventListener('click', closeVendorPaymentModal);
}

function addQuotationItem() {
  const productId = quotationProductSelect.value;
  const qty = Number(document.getElementById('quotation-qty').value || 0);
  const price = Number(document.getElementById('quotation-price').value || 0);
  if (!productId || qty <= 0 || price < 0) {
    alert('Choose a product, quantity, and valid price.');
    return;
  }
  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;
  const existing = quotationDraft.items.find((entry) => entry.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.price = price;
    existing.total = existing.qty * price;
  } else {
    quotationDraft.items.push({ productId, name: product.name, qty, price, total: qty * price });
  }
  renderQuotationDraft();
}

function addInvoiceItem() {
  const productId = invoiceProductSelect.value;
  const qty = Number(document.getElementById('invoice-qty').value || 0);
  const cost = Number(document.getElementById('invoice-cost').value || 0);
  if (!productId || qty <= 0 || cost < 0) {
    alert('Choose a product, quantity, and valid cost.');
    return;
  }
  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;
  const existing = invoiceDraft.items.find((entry) => entry.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.cost = cost;
    existing.total = existing.qty * cost;
  } else {
    invoiceDraft.items.push({ productId, name: product.name, qty, cost, total: qty * cost });
  }
  renderInvoiceDraft();
}

function calculateDocumentTotals(items, discount, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const safeDiscount = Math.max(Number(discount || 0), 0);
  const taxable = Math.max(subtotal - safeDiscount, 0);
  const tax = taxable * Math.max(Number(taxRate || 0), 0) / 100;
  return { subtotal, discount: safeDiscount, tax, total: taxable + tax };
}

function renderQuotationDraft() {
  const totals = calculateDocumentTotals(quotationDraft.items, document.getElementById('quotation-discount').value, document.getElementById('quotation-tax').value);
  document.getElementById('quotation-subtotal').textContent = formatCurrency(totals.subtotal);
  document.getElementById('quotation-discount-total').textContent = formatCurrency(totals.discount);
  document.getElementById('quotation-tax-total').textContent = formatCurrency(totals.tax);
  document.getElementById('quotation-total').textContent = formatCurrency(totals.total);
  quotationCartBox.innerHTML = quotationDraft.items.length ? `<div class="list-header"><span>Item</span><span>Qty</span><span>Price</span><span>Total</span><span></span></div>${quotationDraft.items.map((item) => `<div class="list-row"><span>${escapeHtml(item.name)}</span><span>${item.qty}</span><span>${formatCurrency(item.price)}</span><span>${formatCurrency(item.total)}</span><button class="small-btn delete" data-remove-quotation-item="${item.productId}">Remove</button></div>`).join('')}` : '<div class="empty-state">No quotation items yet.</div>';
  quotationCartBox.querySelectorAll('[data-remove-quotation-item]').forEach((button) => button.addEventListener('click', () => {
    quotationDraft.items = quotationDraft.items.filter((item) => item.productId !== button.dataset.removeQuotationItem);
    renderQuotationDraft();
  }));
}

function renderInvoiceDraft() {
  const totals = calculateDocumentTotals(invoiceDraft.items, document.getElementById('invoice-discount').value, document.getElementById('invoice-tax').value);
  document.getElementById('invoice-subtotal').textContent = formatCurrency(totals.subtotal);
  document.getElementById('invoice-discount-total').textContent = formatCurrency(totals.discount);
  document.getElementById('invoice-tax-total').textContent = formatCurrency(totals.tax);
  document.getElementById('invoice-total').textContent = formatCurrency(totals.total);
  invoiceCartBox.innerHTML = invoiceDraft.items.length ? `<div class="list-header"><span>Item</span><span>Qty</span><span>Cost</span><span>Total</span><span></span></div>${invoiceDraft.items.map((item) => `<div class="list-row"><span>${escapeHtml(item.name)}</span><span>${item.qty}</span><span>${formatCurrency(item.cost)}</span><span>${formatCurrency(item.total)}</span><button class="small-btn delete" data-remove-invoice-item="${item.productId}">Remove</button></div>`).join('')}` : '<div class="empty-state">No invoice items yet.</div>';
  invoiceCartBox.querySelectorAll('[data-remove-invoice-item]').forEach((button) => button.addEventListener('click', () => {
    invoiceDraft.items = invoiceDraft.items.filter((item) => item.productId !== button.dataset.removeInvoiceItem);
    renderInvoiceDraft();
  }));
}

function clearQuotationDraft() {
  quotationDraft.items = [];
  quotationDraft.editingId = '';
  quotationForm.reset();
  document.getElementById('quotation-date').value = dateISO();
  document.getElementById('quotation-expiry').value = dateISO();
  document.getElementById('quotation-tax').value = Number(state.business.taxRate || 0);
  renderQuotationDraft();
}

function clearInvoiceDraft() {
  invoiceDraft.items = [];
  invoiceDraft.editingId = '';
  invoiceForm.reset();
  document.getElementById('invoice-date').value = dateISO();
  document.getElementById('invoice-due-date').value = dateISO();
  document.getElementById('invoice-tax').value = Number(state.business.taxRate || 0);
  renderInvoiceDraft();
}

async function saveQuotation(event) {
  event.preventDefault();
  if (!hasRole('admin', 'sales')) return;
  const customer = state.customers.find((entry) => entry.id === quotationCustomerSelect.value);
  const date = document.getElementById('quotation-date').value;
  const expiry = document.getElementById('quotation-expiry').value;
  if (!customer || !quotationDraft.items.length || !date || !expiry || expiry < date) {
    alert('Select an existing customer, add an item, and use valid quotation dates.');
    return;
  }
  const totals = calculateDocumentTotals(quotationDraft.items, document.getElementById('quotation-discount').value, document.getElementById('quotation-tax').value);
  try {
    const existing = quotationDraft.editingId ? state.quotations.find((entry) => entry.id === quotationDraft.editingId) : null;
    const response = await localRequest(existing ? `/quotations/${existing.id}` : '/quotations', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify({ quotation_no: existing?.quotationNo || `QT-${Date.now().toString().slice(-7)}`, customer_id: customer.id, branch_id: getActiveBranchId() || null, quotation_date: date, expiry_date: expiry, notes: document.getElementById('quotation-notes').value.trim(), tax_rate: Number(document.getElementById('quotation-tax').value || 0), ...totals, items: quotationDraft.items.map((item) => ({ product_id: item.productId, quantity: item.qty, unit_price: item.price, line_total: item.total })) }) });
    await refreshLocalState();
    clearQuotationDraft();
    renderAll();
  } catch (error) {
    alert(error.message || 'Quotation could not be saved.');
  }
}

async function saveVendorInvoice(event) {
  event.preventDefault();
  if (!hasRole('admin', 'purchase')) return;
  const vendor = state.vendors.find((entry) => entry.id === invoiceVendorSelect.value);
  const invoiceDate = document.getElementById('invoice-date').value;
  const dueDate = document.getElementById('invoice-due-date').value;
  if (!vendor || !invoiceDraft.items.length || !document.getElementById('invoice-reference').value.trim() || !invoiceDate || !dueDate || dueDate < invoiceDate) {
    alert('Select an existing vendor, add an item, and use valid invoice details and dates.');
    return;
  }
  const totals = calculateDocumentTotals(invoiceDraft.items, document.getElementById('invoice-discount').value, document.getElementById('invoice-tax').value);
  try {
    const response = await localRequest(invoiceDraft.editingId ? `/vendor-invoices/${invoiceDraft.editingId}` : '/vendor-invoices', { method: invoiceDraft.editingId ? 'PATCH' : 'POST', body: JSON.stringify({ invoice_no: document.getElementById('invoice-reference').value.trim(), supplier_id: vendor.id, branch_id: getActiveBranchId() || null, invoice_date: invoiceDate, due_date: dueDate, received: document.getElementById('invoice-received').checked, ...totals, items: invoiceDraft.items.map((item) => ({ product_id: item.productId, quantity: item.qty, buying_price: item.cost, line_total: item.total })) }) });
    await refreshLocalState();
    clearInvoiceDraft();
    renderAll();
  } catch (error) {
    alert(error.message || 'Vendor invoice could not be saved.');
  }
}

function bindDisplayPreferences() {
  themeToggle.addEventListener('click', () => {
    state.preferences.darkMode = !state.preferences.darkMode;
    saveState();
    applyDisplayPreferences();
  });
  receiptPaperSize.addEventListener('change', () => {
    state.preferences.receiptPaperSize = receiptPaperSize.value;
    saveState();
  });
  applyDisplayPreferences();
}

function applyDisplayPreferences() {
  const isDark = !!state.preferences.darkMode;
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.textContent = isDark ? '☀ Light mode' : '☾ Dark mode';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  receiptPaperSize.value = state.preferences.receiptPaperSize || 'thermal';
}

function bindCustomerActions() {
  const customerTypeSelect = document.getElementById('customer-type');
  const customerNameInput = document.getElementById('customer-name');
  customerTypeSelect.addEventListener('change', () => {
    const isPhysical = customerTypeSelect.value === 'Physical';
    customerNameInput.value = isPhysical ? 'Walk-in Customer' : '';
    customerNameInput.readOnly = isPhysical;
    customerNameInput.required = !isPhysical;
  });
  customerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('customer-id').value;
    const customerType = document.getElementById('customer-type').value;
    const customer = {
      id: id || uid('cust'),
      name: customerType === 'Physical' ? 'Walk-in Customer' : document.getElementById('customer-name').value.trim(),
      phone: document.getElementById('customer-phone').value.trim(),
      type: customerType,
      balance: Number(document.getElementById('customer-balance').value || 0),
      totalPurchases: 0
    };
    if (customerType === 'Delivery' && !customer.name) {
      alert('Customer name is required.');
      return;
    }

    try {
      const existing = state.customers.find((entry) => entry.id === customer.id);
      const response = await localRequest(existing ? `/customers/${existing.id}` : '/customers', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify({ name: customer.name, phone: customer.phone }) });
      const saved = mapCustomer(response.customer);
      if (existing) Object.assign(existing, saved, { type: customer.type, totalPurchases: existing.totalPurchases });
      else state.customers.push(saved);
      customerForm.reset();
      renderAll();
    } catch (error) {
      alert(error.message || 'Customer could not be saved.');
    }
  });

  document.getElementById('reset-customer-form').addEventListener('click', () => {
    customerForm.reset();
    document.getElementById('customer-id').value = '';
    customerTypeSelect.value = 'Physical';
    customerNameInput.value = 'Walk-in Customer';
    customerNameInput.readOnly = true;
    customerNameInput.required = false;
  });

  customerSearch.addEventListener('input', renderCustomers);
  creditSearch.addEventListener('input', renderCustomers);
  customerTypeSelect.dispatchEvent(new Event('change'));
}

function bindAdminSettingsActions() {
  businessLogoInput.addEventListener('change', () => {
    const file = businessLogoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file for the business logo.');
      businessLogoInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      businessLogoInput.dataset.logoData = reader.result;
      businessLogoPreview.src = reader.result;
      businessLogoPreview.hidden = false;
    });
    reader.readAsDataURL(file);
  });
  mobileMoneyAccountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'owner')) return;
    const id = document.getElementById('mobile-money-account-id').value;
    const account = {
      id: id || uid('mm'),
      network: document.getElementById('mobile-money-account-network').value,
      name: document.getElementById('mobile-money-account-name').value.trim(),
      phone: document.getElementById('mobile-money-account-phone').value.trim(),
      description: document.getElementById('mobile-money-account-description').value.trim(),
      status: document.getElementById('mobile-money-account-status').value,
      branchId: state.business.multiBranches ? mobileMoneyAccountBranch.value : ''
    };
    if (!account.name || !/^0[0-9 ()+-]{8,}$/.test(account.phone)) {
      alert('Enter an account name and valid Mobile Money phone number.');
      return;
    }
    try {
      const existing = state.mobileMoneyAccounts.find((entry) => entry.id === id);
      const payload = { network: account.network, recipient_name: account.name, phone: account.phone, description: account.description, branch_id: account.branchId || null, active: account.status === 'Active' };
      const response = await localRequest(existing ? `/mobile-money/accounts/${existing.id}` : '/mobile-money/accounts', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify(payload) });
      const saved = response.account;
      const mapped = { id: saved.id, network: saved.network, name: saved.recipient_name, phone: saved.phone, description: saved.description || '', status: saved.active ? 'Active' : 'Inactive', branchId: saved.branch_id || '' };
      if (existing) Object.assign(existing, mapped);
      else state.mobileMoneyAccounts.push(mapped);
      resetMobileMoneyAccountForm();
      renderAll();
    } catch (error) {
      alert(error.message || 'Mobile Money account could not be saved.');
    }
  });
  document.getElementById('reset-mobile-money-account').addEventListener('click', resetMobileMoneyAccountForm);
  mobileMoneyAccountList.addEventListener('click', (event) => {
    const edit = event.target.closest('[data-edit-mobile-money]');
    const toggle = event.target.closest('[data-toggle-mobile-money]');
    const remove = event.target.closest('[data-delete-mobile-money]');
    const id = edit?.dataset.editMobileMoney || toggle?.dataset.toggleMobileMoney || remove?.dataset.deleteMobileMoney;
    const account = state.mobileMoneyAccounts.find((entry) => entry.id === id);
    if (!account) return;
    if (edit) {
      document.getElementById('mobile-money-account-id').value = account.id;
      document.getElementById('mobile-money-account-network').value = account.network;
      document.getElementById('mobile-money-account-name').value = account.name;
      document.getElementById('mobile-money-account-phone').value = account.phone;
      document.getElementById('mobile-money-account-description').value = account.description || '';
      document.getElementById('mobile-money-account-status').value = account.status;
      mobileMoneyAccountBranch.value = account.branchId || '';
    } else if (toggle) {
      localRequest(`/mobile-money/accounts/${account.id}`, { method: 'PATCH', body: JSON.stringify({ active: account.status !== 'Active' }) }).then((response) => {
        Object.assign(account, { status: response.account.active ? 'Active' : 'Inactive' });
        renderAll();
      }).catch((error) => alert(error.message || 'Mobile Money account could not be updated.'));
    } else if (remove && confirm(`Delete the ${account.network} receiving account?`)) {
      localRequest(`/mobile-money/accounts/${account.id}`, { method: 'DELETE' }).then(() => {
        state.mobileMoneyAccounts = state.mobileMoneyAccounts.filter((entry) => entry.id !== account.id);
        renderAll();
      }).catch((error) => alert(error.message || 'Mobile Money account could not be deactivated.'));
    }
  });
  businessSettingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'owner')) return;
    const payload = {
      name: document.getElementById('business-name').value.trim(),
      phone: document.getElementById('business-phone').value.trim(),
      email: document.getElementById('business-email').value.trim(),
      address: document.getElementById('business-address').value.trim(),
      logo: businessLogoInput.dataset.logoData || state.business.logo || '',
      country: document.getElementById('business-country').value.trim(),
      currency: document.getElementById('business-currency').value.trim().toUpperCase(),
      tax_rate: Number(document.getElementById('business-tax-rate').value || 0),
      multi_branch: document.getElementById('business-multi-branch').value === 'true',
      opening_balance: Number(document.getElementById('business-opening-balance').value || 0),
      financial_year_start: document.getElementById('business-financial-year').value || null
    };
    try {
      const result = await localRequest('/business', { method: 'PATCH', body: JSON.stringify(payload) });
      state.business = { ...state.business, ...mapBusiness(result.business) };
      saveState();
      applyBranchVisibility();
      renderAdminSettings();
      renderAccounts();
      alert('Business details saved.');
    } catch (error) {
      alert(error.message || 'Business details could not be saved.');
    }
  });

  staffAccountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'owner')) return;
    const id = document.getElementById('staff-id').value;
    const username = document.getElementById('staff-username').value.trim();
    const existing = state.users.find((user) => user.id === id);
    const password = document.getElementById('staff-password').value;
    if (!username || (!existing && !password)) {
      alert('Username and password are required for a new account.');
      return;
    }
    if (state.users.some((user) => user.id !== id && user.username.toLowerCase() === username.toLowerCase())) {
      alert('That username is already registered.');
      return;
    }
    const account = {
      id: id || uid('user'),
      username,
      password,
      displayName: document.getElementById('staff-name').value.trim(),
      role: document.getElementById('staff-role').value,
      phone: document.getElementById('staff-phone').value.trim(),
      email: document.getElementById('staff-email').value.trim(),
      address: document.getElementById('staff-address').value.trim(),
      branchId: state.business.multiBranches ? document.getElementById('staff-branch').value : ''
    };
    if (!account.displayName) {
      alert('Full name is required.');
      return;
    }
    try {
      const response = await localRequest(existing ? `/users/${existing.id}` : '/users', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify({ username: account.username, password: account.password || undefined, display_name: account.displayName, role: account.role, phone: account.phone, email: account.email, address: account.address, branch_id: account.branchId || null }) });
      const saved = mapUser(response.user);
      if (existing) Object.assign(existing, saved);
      else state.users.push(saved);
      resetStaffForm();
      renderAll();
      alert(existing ? 'Account details updated.' : 'Staff account registered.');
    } catch (error) {
      alert(error.message || 'Staff account could not be saved.');
    }
  });

  document.getElementById('reset-staff-form').addEventListener('click', resetStaffForm);
  staffSearch.addEventListener('input', renderAdminSettings);
  staffAccountList.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-user]');
    const deleteButton = event.target.closest('[data-delete-user]');
    if (editButton) editStaffAccount(editButton.dataset.editUser);
    if (deleteButton) deleteStaffAccount(deleteButton.dataset.deleteUser);
  });
}

function resetMobileMoneyAccountForm() {
  mobileMoneyAccountForm.reset();
  document.getElementById('mobile-money-account-id').value = '';
  document.getElementById('mobile-money-account-status').value = 'Active';
  mobileMoneyAccountBranch.value = '';
}

function bindBranchActions() {
  currentBranchSelect.addEventListener('change', async () => {
    state.preferences.currentBranchId = currentBranchSelect.value;
    saveState();
    try {
      await refreshLocalState();
    } catch (error) {
      alert(error.message || 'Branch data could not be refreshed.');
      return;
    }
    renderAll();
  });
  branchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'owner')) return;
    const id = document.getElementById('branch-id').value;
    const branch = {
      id: id || uid('branch'),
      name: document.getElementById('branch-name').value.trim(),
      phone: document.getElementById('branch-phone').value.trim(),
      address: document.getElementById('branch-address').value.trim(),
      managerId: branchManagerSelect.value,
      active: document.getElementById('branch-active').checked
    };
    if (!branch.name || !branch.address) {
      alert('Branch name and address are required.');
      return;
    }
    try {
      const existing = state.branches.find((entry) => entry.id === id);
      const response = await localRequest(existing ? `/branches/${existing.id}` : '/branches', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify({ name: branch.name, phone: branch.phone, address: branch.address, active: branch.active }) });
      const saved = response.branch;
      if (existing) Object.assign(existing, saved);
      else state.branches.push(saved);
      if (!state.preferences.currentBranchId) state.preferences.currentBranchId = saved.id;
      resetBranchForm();
      renderAll();
    } catch (error) {
      alert(error.message || 'Branch could not be saved.');
    }
  });
  document.getElementById('reset-branch').addEventListener('click', resetBranchForm);
  branchSearch.addEventListener('input', renderBranches);
  stockTransferForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'owner')) return;
    const fromBranchId = document.getElementById('transfer-from').value;
    const toBranchId = document.getElementById('transfer-to').value;
    const productId = document.getElementById('transfer-product').value;
    const quantity = Number(document.getElementById('transfer-qty').value || 0);
    if (!fromBranchId || !toBranchId || fromBranchId === toBranchId || !productId || quantity <= 0) {
      alert('Choose different source and destination branches, a product, and a valid quantity.');
      return;
    }
    try {
      await localRequest('/stock-transfers', { method: 'POST', body: JSON.stringify({ from_branch_id: fromBranchId, to_branch_id: toBranchId, items: [{ product_id: productId, quantity }] }) });
      await refreshLocalState();
      renderBranches();
    } catch (error) {
      alert(error.message || 'Stock transfer could not be completed. No stock was changed.');
    }
  });
}

function resetBranchForm() {
  branchForm.reset();
  document.getElementById('branch-id').value = '';
  document.getElementById('branch-active').checked = true;
}

function resetStaffForm() {
  staffAccountForm.reset();
  document.getElementById('staff-id').value = '';
  document.getElementById('staff-password').required = true;
  document.getElementById('staff-submit-button').textContent = 'Register Staff Account';
}

function editStaffAccount(userId) {
  const user = state.users.find((entry) => entry.id === userId);
  if (!user) return;
  document.getElementById('staff-id').value = user.id;
  document.getElementById('staff-name').value = user.displayName || '';
  document.getElementById('staff-username').value = user.username || '';
  document.getElementById('staff-password').value = '';
  document.getElementById('staff-password').required = false;
  document.getElementById('staff-role').value = user.role || 'sales';
  document.getElementById('staff-phone').value = user.phone || '';
  document.getElementById('staff-email').value = user.email || '';
  document.getElementById('staff-address').value = user.address || '';
  document.getElementById('staff-branch').value = user.branchId || '';
  document.getElementById('staff-submit-button').textContent = 'Update Account';
  document.getElementById('staff-name').focus();
}

async function deleteStaffAccount(userId) {
  const user = state.users.find((entry) => entry.id === userId);
  if (!user) return;
  if (user.id === state.session.userId) {
    alert('You cannot delete the account you are currently using.');
    return;
  }
  if (user.role === 'admin' && state.users.filter((entry) => entry.role === 'admin').length === 1) {
    alert('At least one administrator account must remain.');
    return;
  }
  if (!confirm(`Delete the account for ${user.displayName}?`)) return;
  try {
    await localRequest(`/users/${userId}`, { method: 'DELETE' });
    state.users = state.users.filter((entry) => entry.id !== userId);
    renderAll();
  } catch (error) {
    alert(error.message || 'Staff account could not be deactivated.');
  }
}

function bindVendorActions() {
  vendorForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('vendor-id').value;
    const vendor = {
      id: id || uid('vend'),
      name: document.getElementById('vendor-name').value.trim(),
      phone: document.getElementById('vendor-phone').value.trim(),
      amountOwed: Number(document.getElementById('vendor-owed').value || 0)
    };
    if (!vendor.name) {
      alert('Vendor name is required.');
      return;
    }

    try {
      const existing = state.vendors.find((entry) => entry.id === vendor.id);
      const response = await localRequest(existing ? `/suppliers/${existing.id}` : '/suppliers', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify({ name: vendor.name, phone: vendor.phone }) });
      const saved = mapVendor(response.supplier);
      if (existing) Object.assign(existing, saved);
      else state.vendors.push(saved);
      vendorForm.reset();
      renderAll();
    } catch (error) {
      alert(error.message || 'Supplier could not be saved.');
    }
  });

  document.getElementById('reset-vendor-form').addEventListener('click', () => {
    vendorForm.reset();
    document.getElementById('vendor-id').value = '';
  });

  vendorSearch.addEventListener('input', renderVendors);
}

function bindInventoryActions() {
  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'purchase')) {
      alert('Your account can view inventory only.');
      return;
    }
    const id = document.getElementById('product-id').value;
    const product = {
      id: id || uid('prod'),
      name: document.getElementById('product-name').value.trim(),
      category: document.getElementById('product-category').value.trim(),
      sku: document.getElementById('product-sku').value.trim(),
      barcode: document.getElementById('product-barcode').value.trim(),
      buyingPrice: Number(document.getElementById('product-buying-price').value || 0),
      sellingPrice: Number(document.getElementById('product-selling-price').value || 0),
      stock: Number(document.getElementById('product-stock').value || 0),
      lowStockThreshold: Number(document.getElementById('product-low-stock').value || 0),
      expiryDate: document.getElementById('product-expiry-date').value
    };
    if (!product.name) {
      alert('Product name is required.');
      return;
    }

    const normalizedBarcode = product.barcode.toLowerCase();
    if (normalizedBarcode) {
      const duplicate = state.products.find((entry) => {
        if (entry.id === product.id || String(entry.barcode || '').trim().toLowerCase() !== normalizedBarcode) return false;
        if (!state.business.multiBranches) return true;
        return (entry.branchId || '') === getActiveBranchId();
      });
      if (duplicate) {
        alert('This barcode is already assigned to another product.');
        return;
      }
    }
    try {
      const existing = state.products.find((entry) => entry.id === product.id);
      const payload = { name: product.name, category: product.category, sku: product.sku || null, barcode: product.barcode || null, cost_price: product.buyingPrice, selling_price: product.sellingPrice, minimum_stock: product.lowStockThreshold, stock: existing ? undefined : product.stock, branch_id: getActiveBranchId() || undefined };
      const response = await localRequest(existing ? `/products/${existing.id}` : '/products', { method: existing ? 'PATCH' : 'POST', body: JSON.stringify(payload) });
      await refreshLocalState();
      productForm.reset();
      renderAll();
    } catch (error) {
      alert(error.message || 'Product could not be saved.');
    }
  });

  document.getElementById('reset-product-form').addEventListener('click', () => {
    productForm.reset();
    document.getElementById('product-id').value = '';
  });
  productSearch.addEventListener('input', async () => {
    if (!productSearch.value.trim()) return renderInventory();
    try {
      const branchId = getActiveBranchId();
      const query = new URLSearchParams({ q: productSearch.value.trim() });
      if (branchId) query.set('branch_id', branchId);
      const result = await localRequest(`/products?${query}`);
      state.products = (result.products || []).map(mapProduct);
      renderInventory();
    } catch (error) {
      alert(error.message || 'Products could not be searched.');
    }
  });
}

function bindAccountActions() {
  expenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const item = {
      id: uid('exp'),
      businessId: state.business.id || 'business-local',
      branchId: getActiveBranchId(),
      name: document.getElementById('expense-name').value.trim(),
      amount: Number(document.getElementById('expense-amount').value || 0),
      date: document.getElementById('expense-date').value || dateISO(),
      description: document.getElementById('expense-description').value.trim()
    };
    if (!item.name || item.amount <= 0) {
      alert('Please provide a valid expense name and amount.');
      return;
    }
    try {
      const response = await localRequest('/expenses', { method: 'POST', body: JSON.stringify({ name: item.name, amount: item.amount, description: item.description, expense_date: item.date }) });
      state.expenses.push(mapExpense(response.expense));
        await refreshLocalSummary();
      expenseForm.reset();
      renderAccounts();
    } catch (error) {
      alert(error.message || 'Expense could not be saved.');
    }
  });

  paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const item = {
      id: uid('pay'),
      businessId: state.business.id || 'business-local',
      branchId: getActiveBranchId(),
      type: document.getElementById('payment-type').value,
      label: document.getElementById('payment-label').value.trim(),
      amount: Number(document.getElementById('payment-amount').value || 0),
      date: document.getElementById('payment-date').value || dateISO()
    };
    if (!item.label || item.amount <= 0) {
      alert('Please provide a valid payment label and amount.');
      return;
    }
    try {
      const response = await localRequest('/payments', { method: 'POST', body: JSON.stringify({ method: item.type === 'Income' ? 'Cash' : 'Bank Transfer', amount: item.amount }) });
      state.payments.push(mapPayment(response.payment));
        await refreshLocalSummary();
      paymentForm.reset();
      renderAccounts();
    } catch (error) {
      alert(error.message || 'Payment could not be saved.');
    }
  });

  [reportType, reportFrom, reportTo].forEach((control) => control.addEventListener('input', renderTransactionReport));
  expenseSearch.addEventListener('input', renderAccounts);
  document.getElementById('print-report').addEventListener('click', printTransactionReport);
}

function bindDeliveryActions() {
  [deliveryFilterDate, deliveryFilterStatus, deliveryFilterDriver, deliveryFilterCustomer].forEach((control) => {
    control.addEventListener('input', renderDeliveries);
    control.addEventListener('change', renderDeliveries);
  });
  deliveryListBox.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-delivery-action]');
    if (!actionButton) return;
    handleDeliveryAction(actionButton.dataset.deliveryAction, actionButton.dataset.deliveryId);
  });
  document.getElementById('delivery-modal-cancel').addEventListener('click', closeDeliveryModal);
  deliveryModalForm.addEventListener('submit', submitDeliveryModal);
  deliveryModalFields.addEventListener('change', (event) => {
    if (event.target.id === 'delivery-failure-reason') {
      const descriptionField = document.getElementById('delivery-failure-description-field');
      const descriptionInput = document.getElementById('delivery-failure-description');
      const requiresDescription = event.target.value === 'Other';
      descriptionField.hidden = !requiresDescription;
      descriptionInput.required = requiresDescription;
    }
  });
}

function bindHistoryActions() {
  historyYearSelect.addEventListener('change', () => {
    historyView.year = Number(historyYearSelect.value);
    historyView.day = 1;
    renderHistoryCalendar();
  });

  historyMonthSelect.addEventListener('change', () => {
    historyView.month = Number(historyMonthSelect.value);
    historyView.day = 1;
    renderHistoryCalendar();
  });

  document.getElementById('history-today').addEventListener('click', () => {
    const today = new Date();
    historyView.year = today.getFullYear();
    historyView.month = today.getMonth();
    historyView.day = today.getDate();
    renderHistoryCalendar();
  });

  historyCalendar.addEventListener('click', (event) => {
    const dayButton = event.target.closest('[data-history-day]');
    if (!dayButton) return;
    historyView.day = Number(dayButton.dataset.historyDay);
    renderHistoryCalendar();
  });
}

function addSaleItem() {
  const productId = salesProductSelect.value;
  const qty = Number(salesQtyInput.value || 0);
  if (!productId || qty <= 0) {
    alert('Choose a valid product and quantity.');
    return;
  }

  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;

  if (qty > product.stock) {
    alert(`Only ${product.stock} units available for ${product.name}.`);
    return;
  }

  const existing = saleDraft.items.find((entry) => entry.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.total = existing.qty * product.sellingPrice;
  } else {
    saleDraft.items.push({
      productId: product.id,
      name: product.name,
      qty,
      price: product.sellingPrice,
      total: product.sellingPrice * qty
    });
  }

  saleDraft.customerId = salesCustomerSelect.value || state.customers[0]?.id || '';
  saleDraft.paymentMethod = salesPaymentMethod.value;
  renderSalesSummary();
}

function clearSaleDraft() {
  saleDraft.items = [];
  saleDraft.customerId = salesCustomerSelect.value || state.customers[0]?.id || '';
  saleDraft.discount = 0;
  saleDraft.taxRate = 0;
  salesDiscountInput.value = '0';
  document.getElementById('mobile-money-payer-name').value = '';
  document.getElementById('mobile-money-payer-phone').value = '';
  document.getElementById('mobile-money-reference').value = '';
  document.getElementById('mobile-money-notes').value = '';
  document.getElementById('other-payment-reference').value = '';
  document.getElementById('credit-customer-name').value = '';
  document.getElementById('credit-customer-phone').value = '';
  document.getElementById('credit-limit').value = '';
  document.getElementById('credit-due-date').value = '';
  document.getElementById('credit-notes').value = '';
  document.getElementById('sales-requires-delivery').checked = false;
  document.getElementById('sales-delivery-details').hidden = true;
  document.getElementById('sales-delivery-email-field').hidden = true;
  document.getElementById('sales-delivery-address-field').hidden = true;
  document.getElementById('sales-delivery-fee-field').hidden = true;
  document.getElementById('sales-delivery-customer-name').required = false;
  document.getElementById('sales-delivery-customer-email').required = false;
  document.getElementById('sales-delivery-customer-name').value = '';
  document.getElementById('sales-delivery-customer-email').value = '';
  document.getElementById('sales-delivery-address').required = false;
  document.getElementById('sales-delivery-address').value = '';
  document.getElementById('sales-delivery-fee').value = '0';
  renderSalesSummary();
}

async function completeSale() {
  if (!hasRole('admin', 'sales')) {
    alert('Your account can view sales but cannot record sales.');
    return;
  }
  if (!saleDraft.items.length) {
    alert('Add at least one item to the sale.');
    return;
  }

  const subtotal = saleDraft.items.reduce((sum, item) => sum + item.total, 0);
  const discount = Number(saleDraft.discount || 0);
  const taxRate = Number(saleDraft.taxRate || 0);
  const tax = Math.max(subtotal - discount, 0) * taxRate / 100;
  const total = Math.max(subtotal - discount, 0) + tax;
  const requiresDelivery = document.getElementById('sales-requires-delivery').checked;
  const deliveryCustomerName = document.getElementById('sales-delivery-customer-name').value.trim();
  const deliveryCustomerEmail = document.getElementById('sales-delivery-customer-email').value.trim();
  const deliveryAddress = document.getElementById('sales-delivery-address').value.trim();
  const deliveryFee = Number(document.getElementById('sales-delivery-fee').value || 0);
  const paymentDetails = getPaymentDetails();
  if (!paymentDetails) return;
  if (requiresDelivery && (!deliveryCustomerName || !deliveryAddress)) {
    alert('Delivery customer name and address are required for a delivery sale.');
    return;
  }
  if (requiresDelivery && !deliveryCustomerEmail) {
    alert('A customer email is required so the delivery code and order details can be sent.');
    return;
  }
  const customer = requiresDelivery
    ? await findOrCreateDeliveryCustomer(deliveryCustomerName, deliveryCustomerEmail)
    : state.customers.find((entry) => entry.id === saleDraft.customerId) || state.customers.find((entry) => entry.id === 'cust-1') || state.customers[0];
  const creditAccount = saleDraft.paymentMethod === 'Credit' ? findOrCreateCreditAccount(paymentDetails) : null;
  if (creditAccount && creditAccount.creditLimit > 0 && Number(creditAccount.balance || 0) + total > creditAccount.creditLimit) {
    alert(`This sale exceeds the credit limit of ${formatCurrency(creditAccount.creditLimit)}.`);
    return;
  }
  const unavailableItem = saleDraft.items.find((item) => item.qty > Number(state.products.find((product) => product.id === item.productId)?.stock || 0));
  if (unavailableItem) {
    alert(`Insufficient stock for ${unavailableItem.name}.`);
    return;
  }
  const cashier = state.users.find((entry) => entry.id === salesCashierSelect.value) || getCurrentUser();
  const sale = {
    id: uid('sale'),
    businessId: state.business.id || 'business-local',
    branchId: getActiveBranchId(),
    createdAt: new Date().toISOString(),
    customerId: customer.id,
    customerName: customer.name,
    customerType: requiresDelivery ? 'Delivery' : 'Physical',
    cashierId: cashier.id,
    cashierName: cashier.displayName,
    items: saleDraft.items.map((item) => ({ ...item })),
    subtotal,
    discount,
    taxRate,
    tax,
    total,
    paymentMethod: saleDraft.paymentMethod,
    paymentDetails,
    creditAccountId: creditAccount?.id || '',
    status: 'Completed',
    receiptNo: `POS-${Date.now().toString().slice(-6)}`,
    requiresDelivery,
    deliveryAddress: requiresDelivery ? deliveryAddress : '',
    deliveryFee: requiresDelivery ? deliveryFee : 0,
    customerEmail: requiresDelivery ? deliveryCustomerEmail : ''
  };

  const saleItems = sale.items;
  try {
    const response = await localRequest('/sales', { method: 'POST', body: JSON.stringify({
      receipt_no: sale.receiptNo,
      customer_id: customer.id,
      cashier_id: cashier.id,
      branch_id: getActiveBranchId() || null,
      items: sale.items.map((item) => ({ product_id: item.productId, quantity: item.qty, unit_price: item.price, discount: 0, tax: 0, line_total: item.total })),
      subtotal, discount, tax, payment_method: sale.paymentMethod,
      payment_account_id: paymentDetails.receivingAccountId || null,
      payment_details: paymentDetails,
      quotation_id: document.getElementById('complete-sale').dataset.quotationId || null
    }) });
    sale.id = response.sale.id;
    sale.createdAt = response.sale.created_at;
    saleItems.forEach((item) => {
      const product = state.products.find((entry) => entry.id === item.productId);
      if (product) product.stock = Math.max(product.stock - item.qty, 0);
    });
    if (sale.paymentMethod === 'Credit' && creditAccount) creditAccount.balance = Number(creditAccount.balance || 0) + total;
    customer.totalPurchases = Number(customer.totalPurchases || 0) + total;
    state.sales.unshift(sale);
    await refreshLocalSummary();
  } catch (error) {
    alert(error.message || 'Sale could not be completed. No stock or payment was changed.');
    return;
  }
  const quotationId = document.getElementById('complete-sale').dataset.quotationId;
  if (quotationId) {
    const quotation = state.quotations.find((entry) => entry.id === quotationId);
    if (quotation) {
      quotation.convertedSaleId = sale.id;
      quotation.status = 'Accepted';
    }
    delete document.getElementById('complete-sale').dataset.quotationId;
  }
  if (requiresDelivery) await createDeliveryFromSale(sale, customer);
  lastReceiptText = buildReceiptText(sale);
  receiptPreview.textContent = lastReceiptText;
  clearSaleDraft();
  renderAll();
  renderDashboard();
}

function getPaymentDetails() {
  const method = salesPaymentMethod.value;
  if (method === 'Mobile Money') {
    const account = state.mobileMoneyAccounts.find((entry) => entry.id === mobileMoneyAccountSelect.value && entry.status === 'Active' && isAccountAvailableForCurrentBranch(entry));
    if (!account) {
      alert('Configure and select an active business Mobile Money receiving account first.');
      return null;
    }
    return {
      network: account.network,
      receivingAccountId: account.id,
      receivingAccountName: account.name,
      receivingAccountPhone: account.phone,
      payerName: document.getElementById('mobile-money-payer-name').value.trim(),
      payerPhone: document.getElementById('mobile-money-payer-phone').value.trim(),
      transactionReference: document.getElementById('mobile-money-reference').value.trim(),
      notes: document.getElementById('mobile-money-notes').value.trim(),
      status: 'Recorded - API not connected'
    };
  }
  if (method === 'Credit') {
    const name = document.getElementById('credit-customer-name').value.trim();
    const phone = document.getElementById('credit-customer-phone').value.trim();
    const creditLimit = Number(document.getElementById('credit-limit').value || 0);
    const dueDate = document.getElementById('credit-due-date').value;
    const notes = document.getElementById('credit-notes').value.trim();
    if (!name || !phone || !dueDate) {
      alert('Credit customer name, phone, and due date are required.');
      return null;
    }
    return { name, phone, creditLimit, dueDate, notes };
  }
  if (method === 'Card' || method === 'Bank Transfer') return { reference: document.getElementById('other-payment-reference').value.trim() };
  return {};
}

function findOrCreateCreditAccount(details) {
  let account = state.creditAccounts.find((entry) => entry.phone === details.phone);
  if (!account) {
    account = {
      id: uid('credit'),
      name: details.name,
      phone: details.phone,
      balance: 0,
      creditLimit: details.creditLimit,
      dueDate: details.dueDate,
      notes: details.notes || '',
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    state.creditAccounts.push(account);
  } else {
    account.name = details.name;
    account.creditLimit = details.creditLimit;
    account.dueDate = details.dueDate;
    account.notes = details.notes || account.notes;
    account.status = 'Open';
  }
  return account;
}

async function createDeliveryFromSale(sale, customer) {
  try {
    const response = await localRequest('/deliveries', { method: 'POST', body: JSON.stringify({ delivery_no: `D${sale.receiptNo.replace(/\D/g, '')}`, sale_id: sale.id, customer_id: customer.id, customer_name: customer.name, customer_email: sale.customerEmail || customer.email || '', phone: customer.phone || '', address: sale.deliveryAddress, order_total: sale.total, fee: sale.deliveryFee, status: 'Pending', pin: String(Math.floor(1000 + Math.random() * 9000)), branch_id: sale.branchId || null }) });
    state.deliveries.unshift(mapDelivery(response.delivery));
  } catch (error) {
    alert(error.message || 'Delivery could not be saved. The sale was saved, but no local delivery fallback was created.');
  }
}

async function findOrCreateDeliveryCustomer(name, email = '') {
  const normalizedName = name.trim().toLowerCase();
  const existing = state.customers.find((customer) => customer.type === 'Delivery' && customer.name.trim().toLowerCase() === normalizedName);
  if (existing) {
    if (email) existing.email = email;
    if (email && existing.email !== email) {
      const response = await localRequest(`/customers/${existing.id}`, { method: 'PATCH', body: JSON.stringify({ email }) });
      Object.assign(existing, mapCustomer(response.customer));
    }
    return existing;
  }

  const customer = {
    id: uid('cust'),
    name: name.trim(),
    phone: '',
    email,
    type: 'Delivery',
    balance: 0,
    totalPurchases: 0
  };
  const response = await localRequest('/customers', { method: 'POST', body: JSON.stringify({ name: customer.name, phone: customer.phone, email: customer.email }) });
  const saved = mapCustomer(response.customer);
  state.customers.push(saved);
  return saved;
}

function isAccountAvailableForCurrentBranch(account) {
  const activeBranchId = getActiveBranchId();
  return state.business.multiBranches ? account.branchId === activeBranchId : !account.branchId;
}

function renderMobileMoneyAccountOptions() {
  if (!mobileMoneyAccountSelect) return;
  const selected = mobileMoneyAccountSelect.value;
  const accounts = state.mobileMoneyAccounts.filter((account) => account.status === 'Active' && isAccountAvailableForCurrentBranch(account));
  mobileMoneyAccountSelect.innerHTML = accounts.length
    ? accounts.map((account) => `<option value="${account.id}">${escapeHtml(account.network)} - ${escapeHtml(account.name)} - ${escapeHtml(account.phone)}</option>`).join('')
    : '<option value="">No active receiving account configured</option>';
  mobileMoneyAccountSelect.value = accounts.some((account) => account.id === selected) ? selected : accounts[0]?.id || '';
}

function addPurchaseItem() {
  const productId = purchaseProductSelect.value;
  const qty = Number(purchaseQtyInput.value || 0);
  const sellingPrice = Number(purchasePriceInput.value || 0);
  const purchaseSellingPrice = Number(purchaseSellingPriceInput.value || 0);
  const expiryDate = purchaseExpiryDateInput.value;
  if (!productId || qty <= 0 || sellingPrice < 0 || purchaseSellingPrice < 0) {
    alert('Choose a product, quantity, buying price, and selling price.');
    return;
  }

  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;

  const existing = purchaseDraft.items.find((entry) => entry.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.total = existing.qty * sellingPrice;
    existing.sellingPrice = purchaseSellingPrice;
    existing.expiryDate = expiryDate;
  } else {
    purchaseDraft.items.push({
      productId: product.id,
      name: product.name,
      qty,
      buyingPrice: sellingPrice,
      sellingPrice: purchaseSellingPrice,
      expiryDate,
      total: qty * sellingPrice
    });
  }
  purchaseDraft.vendorId = purchaseVendorSelect.value || state.vendors[0]?.id || '';
  renderPurchases();
}

async function completePurchase() {
  if (!hasRole('admin', 'purchase')) {
    alert('Only admin or purchase accounts can record purchases.');
    return;
  }
  if (!purchaseDraft.items.length) {
    alert('Add at least one purchase item.');
    return;
  }

  const vendorId = purchaseVendorSelect.value || state.vendors[0]?.id || '';
  const vendor = state.vendors.find((entry) => entry.id === vendorId);
  if (!vendor) {
    alert('Select a valid vendor.');
    return;
  }

  const total = purchaseDraft.items.reduce((sum, item) => sum + item.total, 0);
  const record = {
    id: uid('pur'),
    businessId: state.business.id || 'business-local',
    branchId: getActiveBranchId(),
    createdAt: new Date().toISOString(),
    vendorId: vendor.id,
    vendorName: vendor.name,
    actorId: getCurrentUser().id,
    actorName: getCurrentUser().displayName,
    items: purchaseDraft.items.map((item) => ({ ...item })),
    total
  };

  try {
    const response = await localRequest('/purchases', { method: 'POST', body: JSON.stringify({
      reference: `PUR-${Date.now().toString().slice(-7)}`,
      branch_id: getActiveBranchId() || null,
      supplier_id: vendor.id,
      items: record.items.map((item) => ({ product_id: item.productId, quantity: item.qty, buying_price: item.buyingPrice, selling_price: item.sellingPrice, line_total: item.total })),
      subtotal: total, discount: 0, tax: 0
    }) });
    record.id = response.purchase.id;
    record.createdAt = response.purchase.created_at;
    record.items.forEach((item) => {
      const product = state.products.find((entry) => entry.id === item.productId);
      if (product) {
        product.stock += item.qty;
        product.buyingPrice = item.buyingPrice || product.buyingPrice;
        product.sellingPrice = item.sellingPrice || product.sellingPrice;
      }
    });
    vendor.amountOwed = Number(vendor.amountOwed || 0) + total;
    state.purchases.unshift(record);
    await refreshLocalSummary();
  } catch (error) {
    alert(error.message || 'Purchase could not be saved. No inventory was changed.');
    return;
  }
  purchaseDraft.items = [];
  renderAll();
  renderDashboard();
}

function renderAll() {
  renderDashboard();
  renderProductOptions();
  renderCustomerOptions();
  renderCashierOptions();
  renderVendorOptions();
  renderSalesSummary();
  renderPurchases();
  renderQuotationOptions();
  renderInvoiceOptions();
  renderQuotationDraft();
  renderInvoiceDraft();
  renderQuotations();
  renderVendorInvoices();
  renderCustomers();
  renderVendors();
  renderInventory();
  renderAccounts();
  renderDeliveries();
  renderHistoryCalendar();
  renderAdminSettings();
  renderMobileMoneyAccountOptions();
  renderBranches();
  applyBranchVisibility();
  renderBadgeSummary();
  saveState();
}

function renderCashierOptions() {
  const currentUser = getCurrentUser();
  const cashiers = state.users.filter((user) => user.role === 'admin' || user.role === 'sales');
  salesCashierSelect.innerHTML = cashiers.map((user) => `<option value="${user.id}">${user.displayName}</option>`).join('');
  const selectedId = currentUser.role === 'admin' ? salesCashierSelect.value : currentUser.id;
  salesCashierSelect.value = cashiers.some((user) => user.id === selectedId) ? selectedId : currentUser.id;
  salesCashierSelect.disabled = currentUser.role !== 'admin';
}

function renderAdminSettings() {
  if (!businessSettingsForm || !staffAccountList) return;
  document.getElementById('business-name').value = state.business.name || '';
  document.getElementById('business-phone').value = state.business.phone || '';
  document.getElementById('business-email').value = state.business.email || '';
  document.getElementById('business-address').value = state.business.address || '';
  businessLogoInput.value = '';
  businessLogoInput.dataset.logoData = state.business.logo || '';
  businessLogoPreview.src = state.business.logo || '';
  businessLogoPreview.hidden = !state.business.logo;
  document.getElementById('business-country').value = state.business.country || '';
  document.getElementById('business-currency').value = state.business.currency || 'UGX';
  document.getElementById('business-tax-rate').value = Number(state.business.taxRate || 0);
  document.getElementById('business-multi-branch').value = String(!!state.business.multiBranches);
  document.getElementById('business-opening-balance').value = Number(state.business.openingBalance || 0);
  document.getElementById('business-financial-year').value = state.business.financialYearStart || `${new Date().getFullYear()}-01-01`;
  document.querySelectorAll('.brand-icon').forEach((image) => { image.src = state.business.logo || 'assets/suuk logo.jpeg'; });
  renderBranchSelect(branchManagerSelect, state.users.filter((user) => user.role === 'admin' || user.role === 'manager'), 'No manager assigned');
  const activeBranches = state.branches.filter((branch) => branch.active !== false);
  renderBranchSelect(document.getElementById('staff-branch'), activeBranches, 'Business-wide');
  renderBranchSelect(mobileMoneyAccountBranch, activeBranches, 'Business-wide');
  const staffQuery = staffSearch.value.trim().toLowerCase();
  const visibleStaff = state.users.filter((user) => !staffQuery || `${user.displayName} ${user.username} ${formatRole(user.role)} ${user.phone} ${user.email}`.toLowerCase().includes(staffQuery));
  staffAccountList.innerHTML = `
    <div class="list-header"><span>Account</span><span>Contact</span><span>Department</span><span>Status</span><span>Actions</span></div>
    ${visibleStaff.map((user) => `
      <div class="list-row">
        <span><strong>${escapeHtml(user.displayName)}</strong><br><span class="text-muted">@${escapeHtml(user.username)}</span></span>
        <span>${escapeHtml(user.phone || 'No phone')}<br><span class="text-muted">${escapeHtml(user.email || 'No email')}</span></span>
        <span>${formatRole(user.role)}<br><span class="text-muted">${escapeHtml(user.address || 'No address')} · ${escapeHtml(state.branches.find((branch) => branch.id === user.branchId)?.name || 'Business-wide')}</span></span>
        <span class="text-muted">${user.active === false ? 'Inactive account' : 'Active account'}</span>
        <span class="action-controls">
          <button class="small-btn edit" data-edit-user="${user.id}">Edit</button>
          <button class="small-btn delete" data-delete-user="${user.id}">Delete</button>
        </span>
      </div>
    `).join('')}
  `;
  mobileMoneyAccountList.innerHTML = state.mobileMoneyAccounts.length ? `
    <div class="list-header"><span>Network / Account</span><span>Receiving Number</span><span>Branch</span><span>Status</span><span>Actions</span></div>
    ${state.mobileMoneyAccounts.map((account) => `<div class="list-row"><span><strong>${escapeHtml(account.network)} · ${escapeHtml(account.name)}</strong><br><span class="text-muted">${escapeHtml(account.description || 'No description')}</span></span><span>${escapeHtml(account.phone)}</span><span>${escapeHtml(state.branches.find((branch) => branch.id === account.branchId)?.name || 'Business-wide')}</span><span class="muted">${escapeHtml(account.status)}</span><span class="action-controls"><button class="small-btn edit" data-edit-mobile-money="${account.id}">Edit</button><button class="small-btn" data-toggle-mobile-money="${account.id}">${account.status === 'Active' ? 'Deactivate' : 'Activate'}</button><button class="small-btn delete" data-delete-mobile-money="${account.id}">Delete</button></span></div>`).join('')}
  ` : '<div class="empty-state">No Mobile Money receiving accounts configured.</div>';
}

function renderBranchSelect(select, entries, emptyLabel) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = `<option value="">${emptyLabel}</option>${entries.map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name || entry.displayName)}</option>`).join('')}`;
  select.value = entries.some((entry) => entry.id === current) ? current : '';
}

function renderBranches() {
  if (!branchListBox) return;
  const branchQuery = branchSearch.value.trim().toLowerCase();
  const branches = state.branches;
  const currentUser = getCurrentUser();
  const canViewAllBranches = currentUser?.role === 'admin' || currentUser?.role === 'owner';
  const assignedBranch = branches.find((branch) => branch.id === currentUser?.branchId && branch.active);
  const visibleBranches = canViewAllBranches ? branches.filter((branch) => branch.active) : assignedBranch ? [assignedBranch] : [];
  currentBranchSelect.innerHTML = `${canViewAllBranches ? '<option value="">All Branches</option>' : ''}${visibleBranches.map((branch) => `<option value="${branch.id}">${escapeHtml(branch.name)}</option>`).join('')}`;
  currentBranchSelect.value = canViewAllBranches ? state.preferences.currentBranchId || '' : assignedBranch?.id || '';
  const managerOptions = state.users.filter((user) => user.role === 'admin' || user.role === 'owner' || user.role === 'manager');
  renderBranchSelect(branchManagerSelect, managerOptions, 'No manager assigned');
  document.getElementById('transfer-from').innerHTML = branches.filter((branch) => branch.active).map((branch) => `<option value="${branch.id}">${escapeHtml(branch.name)}</option>`).join('');
  document.getElementById('transfer-to').innerHTML = document.getElementById('transfer-from').innerHTML;
  document.getElementById('transfer-product').innerHTML = state.products.map((product) => `<option value="${product.id}">${escapeHtml(product.name)}</option>`).join('');
  const visibleBranchesForList = branches.filter((branch) => {
    const managerName = state.users.find((user) => user.id === branch.managerId)?.displayName || '';
    return !branchQuery || `${branch.name} ${branch.address} ${branch.phone} ${managerName}`.toLowerCase().includes(branchQuery);
  });
  branchListBox.innerHTML = visibleBranchesForList.length ? `<div class="list-header"><span>Branch</span><span>Address</span><span>Manager</span><span>Status</span><span>Actions</span></div>${visibleBranchesForList.map((branch) => `<div class="list-row"><span><strong>${escapeHtml(branch.name)}</strong></span><span>${escapeHtml(branch.address)}<br>${escapeHtml(branch.phone || 'No phone')}</span><span>${escapeHtml(state.users.find((user) => user.id === branch.managerId)?.displayName || 'Not assigned')}</span><span>${branch.active ? 'Active' : 'Inactive'}</span><span class="action-controls"><button class="small-btn edit" data-edit-branch="${branch.id}">Edit</button><button class="small-btn" data-toggle-branch="${branch.id}">${branch.active ? 'Deactivate' : 'Activate'}</button></span></div>`).join('')}` : '<div class="empty-state">No branches match your search.</div>';
  branchListBox.querySelectorAll('[data-edit-branch]').forEach((button) => button.addEventListener('click', () => editBranch(button.dataset.editBranch)));
  branchListBox.querySelectorAll('[data-toggle-branch]').forEach((button) => button.addEventListener('click', () => toggleBranch(button.dataset.toggleBranch)));
  stockTransferList.innerHTML = state.stockTransfers.length ? `<div class="list-header"><span>Transfer</span><span>Product</span><span>Quantity</span><span>Status</span></div>${state.stockTransfers.map((transfer) => `<div class="list-row"><span>${escapeHtml(state.branches.find((branch) => branch.id === transfer.fromBranchId)?.name || '—')} → ${escapeHtml(state.branches.find((branch) => branch.id === transfer.toBranchId)?.name || '—')}</span><span>${escapeHtml(state.products.find((product) => product.id === transfer.productId)?.name || '—')}</span><span>${transfer.quantity}</span><span>${transfer.status}</span></div>`).join('')}` : '<div class="empty-state">No stock transfers prepared.</div>';
}

function editBranch(branchId) {
  const branch = state.branches.find((entry) => entry.id === branchId);
  if (!branch) return;
  document.getElementById('branch-id').value = branch.id;
  document.getElementById('branch-name').value = branch.name;
  document.getElementById('branch-phone').value = branch.phone || '';
  document.getElementById('branch-address').value = branch.address || '';
  document.getElementById('branch-manager').value = branch.managerId || '';
  document.getElementById('branch-active').checked = branch.active !== false;
}

async function toggleBranch(branchId) {
  const branch = state.branches.find((entry) => entry.id === branchId);
  if (!branch) return;
  try {
    const response = await localRequest(`/branches/${branch.id}`, { method: 'PATCH', body: JSON.stringify({ active: !branch.active }) });
    Object.assign(branch, response.branch);
    if (!branch.active && state.preferences.currentBranchId === branch.id) state.preferences.currentBranchId = '';
    renderAll();
  } catch (error) {
    alert(error.message || 'Branch could not be updated.');
  }
}

function getTransactionHistory() {
  const entries = [];
  const currentUser = getCurrentUser();
  const role = currentUser?.role;

  const visibleSales = getVisibleSales();
  visibleSales.forEach((sale) => {
    entries.push({
      id: sale.id,
      type: 'Sale',
      label: sale.receiptNo,
      amount: sale.total,
      date: sale.createdAt || new Date().toISOString(),
      reference: `${sale.customerName} · Cashier: ${sale.cashierName || 'Admin'}`,
      category: 'Sales',
      direction: 'income'
    });
  });

  const visiblePurchases = getVisiblePurchases();
  visiblePurchases.forEach((purchase) => {
    entries.push({
      id: purchase.id,
      type: 'Purchase',
      label: purchase.vendorName,
      amount: purchase.total,
      date: purchase.createdAt || new Date().toISOString(),
      reference: `${purchase.vendorName} · By: ${purchase.actorName || 'Admin'}`,
      category: 'Purchases',
      direction: 'expense'
    });
  });

  if (role === 'admin') state.expenses.forEach((expense) => {
    entries.push({
      id: expense.id,
      type: 'Expense',
      label: expense.name,
      amount: expense.amount,
      date: expense.date ? `${expense.date}T00:00:00` : new Date().toISOString(),
      reference: expense.description || 'Operating cost',
      category: 'Expenses',
      direction: 'expense'
    });
  });

  if (role === 'admin') state.payments.forEach((payment) => {
    entries.push({
      id: payment.id,
      type: payment.type,
      label: payment.label,
      amount: payment.amount,
      date: payment.date ? `${payment.date}T00:00:00` : new Date().toISOString(),
      reference: payment.label,
      category: payment.type === 'Income' ? 'Cash In' : 'Cash Out',
      direction: payment.type === 'Income' ? 'income' : 'expense'
    });
  });

  if (role === 'admin') state.quotations.forEach((quotation) => {
    entries.push({
      id: quotation.id,
      type: 'Quotation',
      label: quotation.quotationNo,
      amount: quotation.total,
      date: `${quotation.quotationDate}T00:00:00`,
      reference: `${quotation.customerName} · ${getQuotationStatus(quotation)}`,
      category: 'Quotations',
      direction: 'income'
    });
  });

  if (role === 'admin') state.vendorInvoices.forEach((invoice) => {
    entries.push({
      id: invoice.id,
      type: 'Vendor Invoice',
      label: invoice.invoiceNo,
      amount: invoice.total,
      date: `${invoice.invoiceDate}T00:00:00`,
      reference: `${invoice.vendorName} · ${getInvoiceStatus(invoice)}`,
      category: 'Vendor Invoices',
      direction: 'expense'
    });
  });

  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getVisibleSales() {
  const currentUser = getCurrentUser();
  if (currentUser?.role === 'sales') {
    return state.sales.filter((sale) => sale.cashierId === currentUser.id);
  }
  return currentUser?.role === 'purchase' ? [] : state.sales;
}

function getVisiblePurchases() {
  const currentUser = getCurrentUser();
  if (currentUser?.role === 'purchase') {
    return state.purchases.filter((purchase) => purchase.actorId === currentUser.id);
  }
  return currentUser?.role === 'sales' ? [] : state.purchases;
}

function buildPeriodSummary(transactions, period) {
  const bucket = {};

  transactions.forEach((entry) => {
    const date = new Date(entry.date);
    const key = period === 'day'
      ? date.toISOString().slice(0, 10)
      : period === 'month'
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : `${date.getFullYear()}`;

    if (!bucket[key]) {
      bucket[key] = { label: key, income: 0, expense: 0, transactions: 0 };
    }

    bucket[key].transactions += 1;
    if (entry.direction === 'income') {
      bucket[key].income += Number(entry.amount || 0);
    } else {
      bucket[key].expense += Number(entry.amount || 0);
    }
  });

  return Object.values(bucket)
    .map((item) => ({ ...item, net: item.income - item.expense }))
    .sort((a, b) => b.label.localeCompare(a.label));
}

function renderLiveTransactions() {
  const today = dateISO();
  const visibleSales = getVisibleSales();
  const visiblePurchases = getVisiblePurchases();
  const liveTransactionTypes = [
    { label: 'Sales', icon: '↗', accent: 'var(--accent)', count: visibleSales.filter((entry) => localDateKey(entry.createdAt) === today).length },
    { label: 'Purchases', icon: '↓', accent: 'var(--primary)', count: visiblePurchases.filter((entry) => localDateKey(entry.createdAt) === today).length },
    { label: 'Expenses', icon: '−', accent: 'var(--danger)', count: state.expenses.filter((entry) => entry.date === today).length },
    { label: 'Payments', icon: '↔', accent: 'var(--warning)', count: state.payments.filter((entry) => entry.date === today).length }
  ];

  document.getElementById('live-transactions-date').textContent = new Date().toLocaleDateString('en-UG', { dateStyle: 'full' });
  document.getElementById('live-transactions').innerHTML = liveTransactionTypes.map((item) => `
    <div class="live-transaction-card" style="--card-accent:${item.accent}" data-dashboard-section="${item.label === 'Sales' ? 'sales' : item.label === 'Purchases' ? 'purchases' : 'accounts'}" role="button" tabindex="0" aria-label="Open ${item.label.toLowerCase()}">
      <div class="live-transaction-icon">${item.icon}</div>
      <h4>${item.label}</h4>
      <strong>${item.count}</strong>
    </div>
  `).join('');
}

function localDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function renderHistoryCalendar() {
  const transactions = getTransactionHistory();
  const transactionDates = new Set(transactions.map((entry) => localDateKey(entry.date)));
  const years = new Set([new Date().getFullYear(), historyView.year]);

  transactions.forEach((entry) => {
    const date = new Date(entry.date);
    if (!Number.isNaN(date.getTime())) years.add(date.getFullYear());
  });

  historyYearSelect.innerHTML = [...years]
    .sort((a, b) => b - a)
    .map((year) => `<option value="${year}">${year}</option>`)
    .join('');
  historyYearSelect.value = String(historyView.year);
  historyMonthSelect.value = String(historyView.month);

  const firstDay = new Date(historyView.year, historyView.month, 1).getDay();
  const daysInMonth = new Date(historyView.year, historyView.month + 1, 0).getDate();
  const selectedDateKey = `${historyView.year}-${String(historyView.month + 1).padStart(2, '0')}-${String(historyView.day).padStart(2, '0')}`;
  const todayKey = localDateKey(new Date());
  const monthName = new Date(historyView.year, historyView.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const headings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    .map((day) => `<div class="calendar-heading">${day}</div>`)
    .join('');
  const emptyDays = Array.from({ length: firstDay }, () => '<div class="calendar-empty"></div>').join('');
  const dayButtons = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateKey = `${historyView.year}-${String(historyView.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const classes = [
      'calendar-day',
      dateKey === selectedDateKey ? 'selected' : '',
      dateKey === todayKey ? 'today' : '',
      transactionDates.has(dateKey) ? 'has-transactions' : ''
    ].filter(Boolean).join(' ');
    return `<button class="${classes}" type="button" data-history-day="${day}" aria-label="View transactions for ${dateKey}"><span class="calendar-day-number">${day}</span></button>`;
  }).join('');

  historyCalendar.innerHTML = `<div class="calendar-month-label">${monthName}</div>${headings}${emptyDays}${dayButtons}`;

  const selectedTransactions = transactions.filter((entry) => localDateKey(entry.date) === selectedDateKey);
  const selectedNet = selectedTransactions.reduce((total, entry) => total + (entry.direction === 'income' ? entry.amount : -entry.amount), 0);
  historySelectedTitle.textContent = `Activity for ${new Date(historyView.year, historyView.month, historyView.day).toLocaleDateString('en-UG', { dateStyle: 'full' })}`;
  historySelectedTotal.textContent = formatCurrency(selectedNet);
  historySelectedList.innerHTML = selectedTransactions.length ? `
    <div class="list-header">
      <span>Record</span>
      <span>Type</span>
      <span>Time</span>
      <span>Amount</span>
      <span>Details</span>
    </div>
    ${selectedTransactions.map((entry) => `
      <div class="list-row">
        <span><strong>${entry.label}</strong></span>
        <span class="history-record-type">${entry.type}</span>
        <span>${formatDate(entry.date)}</span>
        <span class="${entry.direction === 'income' ? 'income' : 'expense'}">${entry.direction === 'income' ? '+' : '-'}${formatCurrency(entry.amount)}</span>
        <span>${entry.reference}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No purchases, sales, expenses, or payments recorded for this day.</div>';
}

function renderDashboard() {
  const role = getCurrentUser()?.role || 'admin';
  const visibleSales = getVisibleSales();
  const visiblePurchases = getVisiblePurchases();
  const today = dateISO();
  const todaySales = visibleSales.filter((sale) => localDateKey(sale.createdAt) === today).reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const todayPurchases = visiblePurchases.filter((purchase) => localDateKey(purchase.createdAt) === today).reduce((sum, purchase) => sum + Number(purchase.total || 0), 0);
  const totalRevenue = state.localSummary ? Number(state.localSummary.sales.total || 0) : visibleSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = state.localSummary ? Number(state.localSummary.expenses.total || 0) : state.expenses.reduce((sum, entry) => sum + entry.amount, 0) + state.payments.filter((item) => item.type === 'Expense').reduce((sum, entry) => sum + entry.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  document.getElementById('dashboard-total-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('dashboard-total-expenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('dashboard-net-profit').textContent = formatCurrency(netProfit);
  document.getElementById('dashboard-today-sales').textContent = formatCurrency(todaySales);
  document.getElementById('dashboard-today-purchases').textContent = formatCurrency(todayPurchases);
  const isAdminDashboard = role === 'admin' || role === 'owner';
  document.querySelectorAll('.dashboard-admin-card').forEach((element) => { element.hidden = !isAdminDashboard; });
  document.getElementById('dashboard-today-sales-card').hidden = role !== 'sales';
  document.getElementById('dashboard-today-purchases-card').hidden = role !== 'purchase';
  renderLiveTransactions();

  const chartYear = new Date().getFullYear();
  const chartData = Array.from({ length: 12 }, (_, monthIndex) => ({
    label: new Date(chartYear, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' }),
    total: visibleSales
      .filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getFullYear() === chartYear && saleDate.getMonth() === monthIndex;
      })
      .reduce((sum, sale) => sum + sale.total, 0)
  }));
  const chartTotal = chartData.reduce((sum, sale) => sum + sale.total, 0);
  document.getElementById('dashboard-chart-total').textContent = formatCurrency(chartTotal);
  document.getElementById('dashboard-chart-caption').textContent = `Monthly sales overview · ${chartYear}`;

  if (chartData.length) {
    const chartWidth = 720;
    const chartHeight = 260;
    const chartPadding = { top: 24, right: 18, bottom: 42, left: 18 };
    const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
    const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    const maxValue = Math.max(...chartData.map((sale) => sale.total), 1);
    const pointGap = chartData.length > 1 ? plotWidth / (chartData.length - 1) : 0;
    const points = chartData.map((sale, index) => ({
      x: chartPadding.left + (chartData.length > 1 ? index * pointGap : plotWidth / 2),
      y: chartPadding.top + plotHeight - (sale.total / maxValue) * plotHeight,
      sale
    }));
    const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
    const areaPoints = `${chartPadding.left},${chartPadding.top + plotHeight} ${linePoints} ${chartPadding.left + plotWidth},${chartPadding.top + plotHeight}`;
    const gridLines = [0, 1, 2, 3].map((step) => {
      const y = chartPadding.top + (plotHeight / 3) * step;
      return `<line class="chart-grid-line" x1="${chartPadding.left}" y1="${y}" x2="${chartPadding.left + plotWidth}" y2="${y}" />`;
    }).join('');
    const pointsMarkup = points.map((point) => `
      <g class="chart-point-group">
        <title>${point.sale.label}: ${formatCurrency(point.sale.total)}</title>
        <circle class="chart-point-halo" cx="${point.x}" cy="${point.y}" r="8" />
        <circle class="chart-point" cx="${point.x}" cy="${point.y}" r="4" />
        ${point.sale.total ? `<text class="chart-value" x="${point.x}" y="${Math.max(point.y - 14, 14)}" text-anchor="middle">${formatCurrency(point.sale.total)}</text>` : ''}
        <text class="chart-label" x="${point.x}" y="${chartHeight - 14}" text-anchor="middle">${point.sale.label}</text>
      </g>
    `).join('');

    document.getElementById('dashboard-chart').innerHTML = `
      <svg class="sales-chart-svg" viewBox="0 0 ${chartWidth} ${chartHeight}" role="img" aria-label="Monthly sales trend for ${chartYear}">
        <defs>
          <linearGradient id="sales-area-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#2f7cff" stop-opacity="0.28" />
            <stop offset="100%" stop-color="#2f7cff" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${gridLines}
        <polygon class="chart-area" points="${areaPoints}" />
        <polyline class="chart-line" points="${linePoints}" />
        ${pointsMarkup}
      </svg>
    `;
  } else {
    document.getElementById('dashboard-chart').innerHTML = '<div class="empty-state">No sales data for charting.</div>';
  }

  const productPerformance = {};
  visibleSales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productPerformance[item.productId]) {
        productPerformance[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productPerformance[item.productId].quantity += Number(item.qty || 0);
      productPerformance[item.productId].revenue += Number(item.total || 0);
    });
  });
  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 4);
  document.getElementById('dashboard-top-products').innerHTML = topProducts.length ? topProducts.map((product, index) => `
    <div class="top-product-row">
      <span class="top-product-rank">${index + 1}</span>
      <span class="top-product-name">${escapeHtml(product.name)}</span>
      <span class="top-product-quantity">${product.quantity} sold</span>
      <strong>${formatCurrency(product.revenue)}</strong>
    </div>
  `).join('') : '<div class="empty-state">No completed sales yet.</div>';

  const summaryItems = role === 'sales' ? [
    { label: 'Products in Stock', value: state.products.reduce((sum, product) => sum + product.stock, 0) },
    { label: 'Low Stock Items', value: state.products.filter((product) => product.stock <= product.lowStockThreshold).length },
    { label: 'Customers', value: state.customers.length },
    { label: 'Vendors', value: state.vendors.length },
    { label: 'Total Quotations', value: state.quotations.length },
    { label: 'Accepted Quotations', value: state.quotations.filter((quotation) => getQuotationStatus(quotation) === 'Accepted').length }
  ] : role === 'purchase' ? [
    { label: 'Products in Stock', value: state.products.reduce((sum, product) => sum + product.stock, 0) },
    { label: 'Low Stock Items', value: state.products.filter((product) => product.stock <= product.lowStockThreshold).length },
    { label: 'Vendors', value: state.vendors.length },
    { label: 'Outstanding Invoices', value: state.vendorInvoices.filter((invoice) => getInvoiceStatus(invoice) !== 'Paid').length },
    { label: 'Overdue Invoices', value: state.vendorInvoices.filter((invoice) => getInvoiceStatus(invoice) === 'Overdue').length },
    { label: 'Amount Owed to Vendors', value: formatCurrency(state.vendorInvoices.reduce((sum, invoice) => sum + Math.max(Number(invoice.total || 0) - Number(invoice.amountPaid || 0), 0), 0)) }
  ] : [
    { label: 'Products in Stock', value: state.products.reduce((sum, product) => sum + product.stock, 0) },
    { label: 'Low Stock Items', value: state.products.filter((product) => product.stock <= product.lowStockThreshold).length },
    { label: 'Customers', value: state.customers.length },
    { label: 'Vendors', value: state.vendors.length },
    { label: 'Total Quotations', value: state.quotations.length },
    { label: 'Accepted Quotations', value: state.quotations.filter((quotation) => getQuotationStatus(quotation) === 'Accepted').length },
    { label: 'Outstanding Invoices', value: state.vendorInvoices.filter((invoice) => getInvoiceStatus(invoice) !== 'Paid').length },
    { label: 'Overdue Invoices', value: state.vendorInvoices.filter((invoice) => getInvoiceStatus(invoice) === 'Overdue').length },
    { label: 'Amount Owed to Vendors', value: formatCurrency(state.vendorInvoices.reduce((sum, invoice) => sum + Math.max(Number(invoice.total || 0) - Number(invoice.amountPaid || 0), 0), 0)) }
  ];

  const summarySections = {
    'Products in Stock': 'inventory', 'Low Stock Items': 'inventory', Customers: 'customers', Vendors: 'vendors',
    'Total Quotations': 'quotations', 'Accepted Quotations': 'quotations', 'Outstanding Invoices': 'vendor-invoices',
    'Overdue Invoices': 'vendor-invoices', 'Amount Owed to Vendors': 'vendor-invoices'
  };
  document.getElementById('dashboard-summary').innerHTML = summaryItems.map((item) => `
    <div class="summary-item" data-dashboard-section="${summarySections[item.label]}" role="button" tabindex="0" aria-label="Open ${item.label.toLowerCase()}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `).join('');

  const recentSales = visibleSales.slice(0, 5);
  const recentPurchases = visiblePurchases.slice(0, 5);
  document.getElementById('dashboard-recent-title').textContent = role === 'purchase' ? 'Recent Purchases' : 'Recent Sales';
  const recentActivity = document.getElementById('dashboard-recent-sales');
  const recentActivitySection = role === 'purchase' ? 'purchases' : 'sales';
  document.getElementById('dashboard-recent-total').textContent = formatCurrency((role === 'purchase' ? recentPurchases : recentSales).reduce((sum, entry) => sum + Number(entry.total || 0), 0));
  recentActivity.dataset.dashboardSection = recentActivitySection;
  recentActivity.setAttribute('role', 'button');
  recentActivity.tabIndex = 0;
  recentActivity.setAttribute('aria-label', `Open ${recentActivitySection}`);
  document.getElementById('dashboard-recent-sales').innerHTML = role === 'purchase' ? (recentPurchases.length ? `
    <div class="list-header"><span>Vendor</span><span>Date</span><span>Total</span><span>Recorded by</span></div>
    ${recentPurchases.map((purchase) => `<div class="list-row"><span>${escapeHtml(purchase.vendorName)}</span><span>${formatDate(purchase.createdAt)}</span><span>${formatCurrency(purchase.total)}</span><span>${escapeHtml(purchase.actorName || 'Admin')}</span></div>`).join('')}
  ` : '<div class="empty-state">No recent purchases.</div>') : (recentSales.length ? `
    <div class="list-header">
      <span>Receipt</span>
      <span>Customer</span>
      <span>Total</span>
      <span>Method</span>
    </div>
    ${recentSales.map((sale) => `
      <div class="list-row">
        <span>${sale.receiptNo}</span>
        <span>${sale.customerName}</span>
        <span>${formatCurrency(sale.total)}</span>
        <span>${sale.paymentMethod}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No recent sales.</div>');

}

function renderProductOptions() {
  const selectedSalesProduct = salesProductSelect.value;
  const selectedPurchaseProduct = purchaseProductSelect.value;
  const productOptions = state.products.map((product) => `<option value="${product.id}">${product.name} · ${product.stock} in stock</option>`).join('');
  const searchableOptions = state.products.map((product) => `<option value="${escapeHtml(product.name)}">${escapeHtml(product.sku || product.barcode || '')}</option>`).join('');
  salesProductOptions.innerHTML = searchableOptions;
  purchaseProductOptions.innerHTML = searchableOptions;
  salesProductSelect.innerHTML = `<option value="">Select product</option>${productOptions}`;
  purchaseProductSelect.innerHTML = `<option value="">Select product</option>${productOptions}`;
  quotationProductSelect.innerHTML = `<option value="">Select product</option>${productOptions}`;
  invoiceProductSelect.innerHTML = `<option value="">Select product</option>${productOptions}`;

  const firstProductId = state.products[0]?.id || '';
  salesProductSelect.value = state.products.some((product) => product.id === selectedSalesProduct)
    ? selectedSalesProduct
    : firstProductId;
  purchaseProductSelect.value = state.products.some((product) => product.id === selectedPurchaseProduct)
    ? selectedPurchaseProduct
    : firstProductId;
  quotationProductSelect.value = quotationProductSelect.value || firstProductId;
  invoiceProductSelect.value = invoiceProductSelect.value || firstProductId;
}

function findProductByBarcodeOrSku(value) {
  return state.products.find((entry) => [entry.barcode, entry.sku].some((code) => String(code || '').toLowerCase() === value));
}

function selectProductFromSearch(input, select) {
  const query = input.value.trim().toLowerCase();
  if (!query) return;
  const product = state.products.find((entry) => `${entry.name} ${entry.sku || ''} ${entry.barcode || ''}`.toLowerCase().includes(query));
  if (product) select.value = product.id;
}

function renderCustomerOptions() {
  const selectedSaleCustomer = salesCustomerSelect.value || saleDraft.customerId;
  salesCustomerSelect.innerHTML = state.customers.map((customer) => `<option value="${customer.id}">${escapeHtml(customer.name)}${customer.phone ? ` · ${escapeHtml(customer.phone)}` : ''}</option>`).join('');
  salesCustomerSelect.value = state.customers.some((customer) => customer.id === selectedSaleCustomer) ? selectedSaleCustomer : state.customers[0]?.id || '';
  saleDraft.customerId = salesCustomerSelect.value;
  quotationCustomerSelect.innerHTML = state.customers.map((customer) => `<option value="${customer.id}">${escapeHtml(customer.name)}</option>`).join('');
  quotationCustomerSelect.value = quotationCustomerSelect.value || state.customers[0]?.id || '';
  salesPaymentMethod.value = saleDraft.paymentMethod;
}

function renderVendorOptions() {
  const options = state.vendors.map((vendor) => `<option value="${vendor.id}">${vendor.name}</option>`).join('');
  purchaseVendorSelect.innerHTML = `<option value="">Select vendor</option>${options}`;
  if (state.vendors.length) {
    purchaseVendorSelect.value = purchaseDraft.vendorId || state.vendors[0].id;
    purchaseDraft.vendorId = purchaseVendorSelect.value;
  }
}

function renderQuotationOptions() {
  quotationCustomerSelect.value = quotationCustomerSelect.value || state.customers[0]?.id || '';
}

function renderInvoiceOptions() {
  const options = state.vendors.map((vendor) => `<option value="${vendor.id}">${escapeHtml(vendor.name)}</option>`).join('');
  invoiceVendorSelect.innerHTML = `<option value="">Select vendor</option>${options}`;
  invoiceVendorSelect.value = invoiceVendorSelect.value || state.vendors[0]?.id || '';
}

function renderSalesSummary() {
  const subtotal = saleDraft.items.reduce((sum, item) => sum + item.total, 0);
  const discount = Number(saleDraft.discount || 0);
  const total = Math.max(subtotal - discount, 0);

  salesSubtotal.textContent = formatCurrency(subtotal);
  salesDiscountTotal.textContent = formatCurrency(discount);
  salesGrandTotal.textContent = formatCurrency(total);

  salesCartBox.innerHTML = saleDraft.items.length ? `
    <div class="list-header">
      <span>Item</span>
      <span>Qty</span>
      <span>Price</span>
      <span>Total</span>
      <span></span>
    </div>
    ${saleDraft.items.map((item) => `
      <div class="list-row">
        <span class="item-name">${item.name}</span>
        <span>${item.qty}</span>
        <span>${formatCurrency(item.price)}</span>
        <span>${formatCurrency(item.total)}</span>
        <button class="small-btn delete" data-remove-sale-item="${item.productId}">Remove</button>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No items yet in this sale.</div>';

  salesCartBox.querySelectorAll('[data-remove-sale-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.removeSaleItem;
      saleDraft.items = saleDraft.items.filter((item) => item.productId !== targetId);
      renderSalesSummary();
    });
  });

  const currentUser = getCurrentUser();
  const salesQuery = salesHistorySearch.value.trim().toLowerCase();
  const visibleSales = getVisibleSales().filter((sale) => !salesQuery || `${sale.receiptNo} ${sale.customerName} ${sale.paymentMethod} ${sale.cashierName}`.toLowerCase().includes(salesQuery));
  document.getElementById('sales-history-total').textContent = formatCurrency(visibleSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0));
  const history = visibleSales.map((sale) => `
    <div class="list-row">
      <span>
        <strong>${sale.receiptNo}</strong><br>
        <span class="text-muted">${formatDate(sale.createdAt)} · ${sale.cashierName || 'Admin'}</span>
      </span>
      <span>${sale.customerName}</span>
      <span>${formatCurrency(sale.total)}</span>
      <span>${sale.paymentMethod}</span>
        ${currentUser?.role === 'admin' ? `<span class="action-controls">
          <button class="small-btn success" data-return-sale="${sale.id}">Return</button>
        </span>` : '<span></span>'}
    </div>
  `).join('');

  salesHistoryBox.innerHTML = visibleSales.length ? `
    <div class="list-header">
      <span>Receipt</span>
      <span>Customer</span>
      <span>Total</span>
      <span>Method</span>
      <span>Action</span>
    </div>
    ${history}
  ` : '<div class="empty-state">No sales recorded yet.</div>';

  salesHistoryBox.querySelectorAll('[data-return-sale]').forEach((button) => {
    button.addEventListener('click', () => {
      const saleId = button.dataset.returnSale;
      returnSale(saleId);
    });
  });

  if (saleDraft.items.length) {
    document.getElementById('sale-status-tag').textContent = 'Draft';
  } else {
    document.getElementById('sale-status-tag').textContent = 'Draft';
  }
}

function renderPurchases() {
  const total = purchaseDraft.items.reduce((sum, item) => sum + item.total, 0);
  purchaseGrandTotal.textContent = formatCurrency(total);

  purchaseCartBox.innerHTML = purchaseDraft.items.length ? `
    <div class="list-header">
      <span>Item</span>
      <span>Qty</span>
      <span>Price</span>
      <span>Total</span>
      <span></span>
    </div>
    ${purchaseDraft.items.map((item) => `
      <div class="list-row">
        <span class="item-name">${item.name}</span>
        <span>${item.qty}</span>
        <span>${formatCurrency(item.buyingPrice)}<br><span class="text-muted">Sell: ${formatCurrency(item.sellingPrice)}</span></span>
        <span>${formatCurrency(item.total)}</span>
        <span><span class="text-muted">Exp: ${formatShortDate(item.expiryDate)}</span><br><button class="small-btn delete" data-remove-purchase-item="${item.productId}">Remove</button></span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No purchase items yet.</div>';

  purchaseCartBox.querySelectorAll('[data-remove-purchase-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.removePurchaseItem;
      purchaseDraft.items = purchaseDraft.items.filter((item) => item.productId !== targetId);
      renderPurchases();
    });
  });

  const currentUser = getCurrentUser();
  const purchaseQuery = purchaseHistorySearch.value.trim().toLowerCase();
  const visiblePurchases = getVisiblePurchases().filter((purchase) => !purchaseQuery || `${purchase.vendorName} ${purchase.actorName} ${purchase.items.map((item) => item.name).join(' ')}`.toLowerCase().includes(purchaseQuery));
  document.getElementById('purchase-history-total').textContent = formatCurrency(visiblePurchases.reduce((sum, purchase) => sum + Number(purchase.total || 0), 0));
  purchaseHistoryBox.innerHTML = visiblePurchases.length ? `
    <div class="list-header">
      <span>Vendor</span>
      <span>Date</span>
      <span>Total</span>
      <span>Recorded by</span>
    </div>
    ${visiblePurchases.map((purchase) => `
      <div class="list-row">
        <span>${purchase.vendorName}</span>
        <span>${formatDate(purchase.createdAt)}</span>
        <span>${formatCurrency(purchase.total)}</span>
        <span>${purchase.actorName || 'Admin'} · ${purchase.items.length} item(s)</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No supplier purchases recorded.</div>';
}

function getQuotationStatus(quotation) {
  if (quotation.expiryDate < dateISO() && !quotation.convertedSaleId && (quotation.status === 'Draft' || quotation.status === 'Sent')) return 'Expired';
  if (quotation.status === 'Draft' || quotation.status === 'Sent' || quotation.status === 'Accepted' || quotation.status === 'Rejected') return quotation.status;
  return 'Expired';
}

function getInvoiceStatus(invoice) {
  if (Number(invoice.amountPaid || 0) >= Number(invoice.total || 0)) return 'Paid';
  if (invoice.dueDate < dateISO()) return 'Overdue';
  return Number(invoice.amountPaid || 0) > 0 ? 'Partially Paid' : 'Unpaid';
}

function renderQuotations() {
  if (!quotationListBox) return;
  const query = quotationSearch.value.trim().toLowerCase();
  const visible = state.quotations.filter((quotation) => `${quotation.quotationNo} ${quotation.customerName}`.toLowerCase().includes(query));
  document.getElementById('quotation-count').textContent = `${visible.length} quotation${visible.length === 1 ? '' : 's'}`;
  document.getElementById('quotation-list-total').textContent = formatCurrency(visible.reduce((sum, quotation) => sum + Number(quotation.total || 0), 0));
  quotationListBox.innerHTML = visible.length ? `<div class="list-header"><span>Quotation</span><span>Customer</span><span>Valid Until</span><span>Total</span><span>Status / Actions</span></div>${visible.map((quotation) => {
    const status = getQuotationStatus(quotation);
    const canConvert = status === 'Accepted' && !quotation.convertedSaleId;
    return `<div class="list-row"><span><strong>${escapeHtml(quotation.quotationNo)}</strong><br><span class="text-muted">${formatShortDate(quotation.quotationDate)}</span></span><span>${escapeHtml(quotation.customerName)}</span><span>${formatShortDate(quotation.expiryDate)}</span><span>${formatCurrency(quotation.total)}</span><span class="action-controls"><span class="muted">${status}</span><button class="small-btn" data-quote-action="view" data-quote-id="${quotation.id}">View</button><button class="small-btn" data-quote-action="edit" data-quote-id="${quotation.id}">Edit</button><button class="small-btn" data-quote-action="print" data-quote-id="${quotation.id}">Print</button>${status === 'Draft' ? `<button class="small-btn success" data-quote-action="status" data-quote-status="Sent" data-quote-id="${quotation.id}">Send</button>` : ''}${status === 'Sent' ? `<button class="small-btn success" data-quote-action="status" data-quote-status="Accepted" data-quote-id="${quotation.id}">Accept</button><button class="small-btn delete" data-quote-action="status" data-quote-status="Rejected" data-quote-id="${quotation.id}">Reject</button>` : ''}${canConvert ? `<button class="small-btn success" data-quote-action="convert" data-quote-id="${quotation.id}">Convert to Sale</button>` : ''}</span></div>`;
  }).join('')}` : '<div class="empty-state">No quotations match your search.</div>';
}

function renderVendorInvoices() {
  if (!invoiceListBox) return;
  const query = invoiceSearch.value.trim().toLowerCase();
  const visible = state.vendorInvoices.filter((invoice) => `${invoice.invoiceNo} ${invoice.vendorName}`.toLowerCase().includes(query));
  document.getElementById('invoice-count').textContent = `${visible.length} invoice${visible.length === 1 ? '' : 's'}`;
  document.getElementById('invoice-list-total').textContent = formatCurrency(visible.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0));
  invoiceListBox.innerHTML = visible.length ? `<div class="list-header"><span>Invoice</span><span>Vendor</span><span>Due</span><span>Balance</span><span>Status / Actions</span></div>${visible.map((invoice) => {
    const status = getInvoiceStatus(invoice);
    const balance = Math.max(Number(invoice.total || 0) - Number(invoice.amountPaid || 0), 0);
    return `<div class="list-row"><span><strong>${escapeHtml(invoice.invoiceNo)}</strong><br><span class="text-muted">${formatShortDate(invoice.invoiceDate)}</span></span><span>${escapeHtml(invoice.vendorName)}</span><span>${formatShortDate(invoice.dueDate)}</span><span>${formatCurrency(balance)}</span><span class="action-controls"><span class="muted">${status}</span><button class="small-btn" data-invoice-action="view" data-invoice-id="${invoice.id}">View</button><button class="small-btn" data-invoice-action="edit" data-invoice-id="${invoice.id}">Edit</button><button class="small-btn success" data-invoice-action="payment" data-invoice-id="${invoice.id}">Record Payment</button><button class="small-btn" data-invoice-action="print" data-invoice-id="${invoice.id}">Print</button></span></div>`;
  }).join('')}` : '<div class="empty-state">No vendor invoices match your search.</div>';
}

function handleQuotationAction(event) {
  const button = event.target.closest('[data-quote-action]');
  if (!button) return;
  const quotation = state.quotations.find((entry) => entry.id === button.dataset.quoteId);
  if (!quotation) return;
  const action = button.dataset.quoteAction;
  if (action === 'status') {
    localRequest(`/quotations/${quotation.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: button.dataset.quoteStatus }) }).then(async () => {
      await refreshLocalState();
      renderQuotations();
    }).catch((error) => alert(error.message || 'Quotation status could not be saved.'));
  } else if (action === 'view' || action === 'print') {
    printDocumentRecord(quotation, 'Quotation', action === 'print');
  } else if (action === 'edit') {
    editQuotation(quotation);
  } else if (action === 'convert') {
    convertQuotationToSale(quotation);
  }
}

function handleVendorInvoiceAction(event) {
  const button = event.target.closest('[data-invoice-action]');
  if (!button) return;
  const invoice = state.vendorInvoices.find((entry) => entry.id === button.dataset.invoiceId);
  if (!invoice) return;
  const action = button.dataset.invoiceAction;
  if (action === 'view' || action === 'print') printDocumentRecord(invoice, 'Vendor Invoice', action === 'print');
  if (action === 'edit') editVendorInvoice(invoice);
  if (action === 'payment') recordVendorInvoicePayment(invoice);
}

function editQuotation(quotation) {
  if (quotation.status !== 'Draft') {
    alert('Only draft quotations can be edited.');
    return;
  }
  quotationCustomerSelect.value = quotation.customerId;
  document.getElementById('quotation-date').value = quotation.quotationDate;
  document.getElementById('quotation-expiry').value = quotation.expiryDate;
  document.getElementById('quotation-discount').value = quotation.discount;
  document.getElementById('quotation-tax').value = quotation.taxRate;
  document.getElementById('quotation-notes').value = quotation.notes || '';
  quotationDraft.items = quotation.items.map((item) => ({ ...item }));
  quotationDraft.editingId = quotation.id;
  renderQuotationDraft();
  renderQuotations();
}

function editVendorInvoice(invoice) {
  if (invoice.amountPaid > 0 || invoice.stockApplied) {
    alert('Paid or received invoices cannot be edited.');
    return;
  }
  const vendor = state.vendors.find((entry) => entry.id === invoice.vendorId);
  invoiceVendorSelect.value = invoice.vendorId;
  document.getElementById('invoice-reference').value = invoice.invoiceNo;
  document.getElementById('invoice-date').value = invoice.invoiceDate;
  document.getElementById('invoice-due-date').value = invoice.dueDate;
  document.getElementById('invoice-discount').value = invoice.discount;
  document.getElementById('invoice-tax').value = invoice.taxRate;
  invoiceDraft.items = invoice.items.map((item) => ({ ...item }));
  invoiceDraft.editingId = invoice.id;
  renderInvoiceDraft();
  renderVendorInvoices();
}

function convertQuotationToSale(quotation) {
  if (quotation.status !== 'Accepted' || quotation.convertedSaleId) return;
  if (!confirm(`Convert ${quotation.quotationNo} to a sale? Inventory will be reduced when the sale is completed.`)) return;
  saleDraft.items = quotation.items.map((item) => ({ productId: item.productId, name: item.name, qty: item.qty, price: item.price, total: item.total }));
  saleDraft.customerId = quotation.customerId;
  saleDraft.discount = quotation.discount;
  saleDraft.taxRate = quotation.taxRate || 0;
  salesDiscountInput.value = quotation.discount;
  salesPaymentMethod.value = 'Cash';
  saleDraft.paymentMethod = 'Cash';
  showSection('sales', '🛒 Sales');
  renderSalesSummary();
  document.getElementById('complete-sale').dataset.quotationId = quotation.id;
}

function applyVendorInvoiceStock(invoice) {
  if (invoice.stockApplied) return;
  invoice.items.forEach((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (product) {
      product.stock += item.qty;
      product.buyingPrice = item.cost || product.buyingPrice;
    }
  });
  invoice.stockApplied = true;
}

function recordVendorInvoicePayment(invoice) {
  const balance = Math.max(Number(invoice.total || 0) - Number(invoice.amountPaid || 0), 0);
  if (!balance) return;
  vendorPaymentInvoiceId = invoice.id;
  document.getElementById('vendor-payment-amount').value = balance;
  document.getElementById('vendor-payment-amount').max = balance;
  vendorPaymentModal.hidden = false;
  document.getElementById('vendor-payment-amount').focus();
}

async function submitVendorInvoicePayment(event) {
  event.preventDefault();
  const invoice = state.vendorInvoices.find((entry) => entry.id === vendorPaymentInvoiceId);
  if (!invoice) return closeVendorPaymentModal();
  const balance = Math.max(Number(invoice.total || 0) - Number(invoice.amountPaid || 0), 0);
  const amount = Number(document.getElementById('vendor-payment-amount').value || 0);
  if (amount <= 0 || amount > balance) {
    alert('Payment must be greater than zero and no more than the outstanding balance.');
    return;
  }
  if (!confirm(`Record payment of ${formatCurrency(amount)}?`)) return;
  try {
    await localRequest(`/vendor-invoices/${invoice.id}/payments`, { method: 'POST', body: JSON.stringify({ amount, method: 'Cash' }) });
    await refreshLocalState();
    closeVendorPaymentModal();
    renderVendorInvoices();
    renderVendors();
  } catch (error) {
    alert(error.message || 'Vendor invoice payment could not be saved.');
  }
}

function closeVendorPaymentModal() {
  vendorPaymentInvoiceId = '';
  vendorPaymentModal.hidden = true;
  vendorPaymentForm.reset();
}

function printDocumentRecord(record, title, printImmediately) {
  const rows = record.items.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.qty}</td><td>${formatCurrency(item.price || item.cost)}</td><td>${formatCurrency(item.total)}</td></tr>`).join('');
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return alert('Please allow pop-ups to view or print this document.');
  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(title)} ${escapeHtml(record.quotationNo || record.invoiceNo)}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#18212f}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #dfe8f5;padding:8px;text-align:left}th{background:#eef4ff}</style></head><body><h1>${escapeHtml(state.business.name)}</h1><h2>${escapeHtml(title)} ${escapeHtml(record.quotationNo || record.invoiceNo)}</h2><p>${escapeHtml(record.customerName || record.vendorName)} · Total: ${formatCurrency(record.total)}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><p>${escapeHtml(record.notes || '')}</p>${printImmediately ? '<script>window.onload=function(){window.print();};</script>' : ''}</body></html>`);
  printWindow.document.close();
}

function renderCustomers() {
  const filter = customerSearch.value.trim().toLowerCase();
  const filtered = state.customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.phone}`.toLowerCase();
    return haystack.includes(filter);
  });
  document.getElementById('customer-total').textContent = formatCurrency(filtered.reduce((sum, customer) => sum + Number(customer.balance || 0), 0));

  customerListBox.innerHTML = filtered.length ? `
    <div class="list-header">
      <span>Customer</span>
      <span>Phone</span>
      <span>Balance</span>
      <span>Action</span>
    </div>
    ${filtered.map((customer) => `
      <div class="list-row">
        <span>
          <strong>${customer.name}</strong><br>
          <span class="text-muted">${customer.type || 'Physical'} · Total purchases: ${formatCurrency(customer.totalPurchases || 0)}</span>
        </span>
        <span>${customer.phone || '—'}</span>
        <span>${formatCurrency(customer.balance || 0)}</span>
        <span class="action-controls">
          <button class="small-btn edit" data-edit-customer="${customer.id}">Edit</button>
          <button class="small-btn delete" data-delete-customer="${customer.id}">Delete</button>
        </span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No customer found.</div>';

  const creditQuery = creditSearch.value.trim().toLowerCase();
  const visibleCreditAccounts = state.creditAccounts.filter((account) => !creditQuery || `${account.name} ${account.phone} ${account.status}`.toLowerCase().includes(creditQuery));
  creditAccountsListBox.innerHTML = visibleCreditAccounts.length ? `
    <div class="list-header">
      <span>Credit Customer</span>
      <span>Balance</span>
      <span>Due / Limit</span>
      <span>Status</span>
    </div>
    ${visibleCreditAccounts.map((account) => `
      <div class="list-row">
        <span><strong>${escapeHtml(account.name)}</strong><br><span class="text-muted">${escapeHtml(account.phone)}</span></span>
        <span>${formatCurrency(account.balance)}</span>
        <span>${formatShortDate(account.dueDate)}<br><span class="text-muted">Limit: ${formatCurrency(account.creditLimit || 0)}</span></span>
        <span>${escapeHtml(account.status || 'Open')}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No credit accounts match your search.</div>';
  document.getElementById('credit-total').textContent = formatCurrency(visibleCreditAccounts.reduce((sum, account) => sum + Number(account.balance || 0), 0));

  customerListBox.querySelectorAll('[data-edit-customer]').forEach((button) => {
    button.addEventListener('click', () => {
      const customer = state.customers.find((entry) => entry.id === button.dataset.editCustomer);
      if (!customer) return;
      document.getElementById('customer-id').value = customer.id;
      document.getElementById('customer-name').value = customer.name;
      document.getElementById('customer-phone').value = customer.phone || '';
      document.getElementById('customer-type').value = customer.type || 'Physical';
      document.getElementById('customer-name').readOnly = customer.type === 'Physical';
      document.getElementById('customer-name').required = customer.type !== 'Physical';
      document.getElementById('customer-balance').value = customer.balance || 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  customerListBox.querySelectorAll('[data-delete-customer]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteCustomer;
      if (!confirm('Delete this customer?')) return;
      localRequest(`/customers/${id}`, { method: 'DELETE' }).then(() => {
        state.customers = state.customers.filter((entry) => entry.id !== id);
        renderAll();
      }).catch((error) => alert(error.message || 'Customer could not be deactivated.'));
    });
  });
}

function renderVendors() {
  const filter = vendorSearch.value.trim().toLowerCase();
  const filtered = state.vendors.filter((vendor) => vendor.name.toLowerCase().includes(filter));
  document.getElementById('vendor-total').textContent = formatCurrency(filtered.reduce((sum, vendor) => sum + Number(vendor.amountOwed || 0), 0));

  vendorListBox.innerHTML = filtered.length ? `
    <div class="list-header">
      <span>Vendor</span>
      <span>Phone</span>
      <span>Owed</span>
      <span>Action</span>
    </div>
    ${filtered.map((vendor) => `
      <div class="list-row">
        <span>
          <strong>${vendor.name}</strong><br>
          <span class="text-muted">Products supplied</span>
        </span>
        <span>${vendor.phone || '—'}</span>
        <span>${formatCurrency(vendor.amountOwed || 0)}</span>
        <span class="action-controls">
          <button class="small-btn edit" data-edit-vendor="${vendor.id}">Edit</button>
          <button class="small-btn delete" data-delete-vendor="${vendor.id}">Delete</button>
        </span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No vendor found.</div>';

  vendorListBox.querySelectorAll('[data-edit-vendor]').forEach((button) => {
    button.addEventListener('click', () => {
      const vendor = state.vendors.find((entry) => entry.id === button.dataset.editVendor);
      if (!vendor) return;
      document.getElementById('vendor-id').value = vendor.id;
      document.getElementById('vendor-name').value = vendor.name;
      document.getElementById('vendor-phone').value = vendor.phone || '';
      document.getElementById('vendor-owed').value = vendor.amountOwed || 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  vendorListBox.querySelectorAll('[data-delete-vendor]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteVendor;
      if (!confirm('Delete this vendor?')) return;
      localRequest(`/suppliers/${id}`, { method: 'DELETE' }).then(() => {
        state.vendors = state.vendors.filter((entry) => entry.id !== id);
        renderAll();
      }).catch((error) => alert(error.message || 'Supplier could not be deactivated.'));
    });
  });
}

function renderInventory() {
  const canManageInventory = hasRole('admin', 'purchase');
  const lowStock = state.products.filter((product) => product.stock <= product.lowStockThreshold);
  const productQuery = productSearch.value.trim().toLowerCase();
  const visibleProducts = state.products.filter((product) => !productQuery || `${product.name} ${product.category} ${product.sku} ${product.barcode}`.toLowerCase().includes(productQuery));
  document.getElementById('inventory-total').textContent = formatCurrency(visibleProducts.reduce((sum, product) => sum + Number(product.stock || 0) * Number(product.sellingPrice || 0), 0));
  lowStockListBox.innerHTML = lowStock.length ? lowStock.map((product) => `
    <div class="low-stock-item">⚠️ ${product.name} — Stock: ${product.stock} (threshold: ${product.lowStockThreshold})</div>
  `).join('') : '<div class="empty-state">All products are above the low-stock threshold.</div>';

  productListBox.innerHTML = `
    <div class="list-header">
      <span>Product</span>
      <span>Price</span>
      <span>Stock</span>
      <span>Expiry</span>
      ${canManageInventory ? '<span>Action</span>' : ''}
    </div>
    ${visibleProducts.map((product) => `
      <div class="list-row">
        <span>
          <strong>${product.name}</strong><br>
          <span class="text-muted">${product.category || 'General'} • ${product.sku || '—'}</span>
        </span>
        <span>${formatCurrency(product.sellingPrice)}<br><span class="text-muted">Buy: ${formatCurrency(product.buyingPrice)}</span></span>
        <span>${product.stock}</span>
        <span class="${expiryClass(product.expiryDate)}">${formatExpiry(product.expiryDate)}</span>
        ${canManageInventory ? `<span class="action-controls">
          <button class="small-btn edit" data-edit-product="${product.id}">Edit</button>
          <button class="small-btn delete" data-delete-product="${product.id}">Delete</button>
        </span>` : ''}
      </div>
    `).join('')}
  `;

  productListBox.querySelectorAll('[data-edit-product]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!canManageInventory) return;
      const product = state.products.find((entry) => entry.id === button.dataset.editProduct);
      if (!product) return;
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-category').value = product.category || '';
      document.getElementById('product-sku').value = product.sku || '';
      document.getElementById('product-barcode').value = product.barcode || product.sku || '';
      document.getElementById('product-buying-price').value = product.buyingPrice || 0;
      document.getElementById('product-selling-price').value = product.sellingPrice || 0;
      document.getElementById('product-stock').value = product.stock || 0;
      document.getElementById('product-low-stock').value = product.lowStockThreshold || 0;
      document.getElementById('product-expiry-date').value = product.expiryDate || '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  productListBox.querySelectorAll('[data-delete-product]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!canManageInventory) return;
      const id = button.dataset.deleteProduct;
      if (!confirm('Delete this product?')) return;
      localRequest(`/products/${id}`, { method: 'DELETE' }).then(() => {
        state.products = state.products.filter((entry) => entry.id !== id);
        renderAll();
      }).catch((error) => alert(error.message || 'Product could not be deactivated.'));
    });
  });

  renderBadgeSummary();
}

function renderAccounts() {
  const today = dateISO();
  const income = state.sales.filter((sale) => sale.createdAt && sale.createdAt.startsWith(today)).reduce((sum, sale) => sum + sale.total, 0);
  const expenses = state.expenses.filter((entry) => entry.date === today).reduce((sum, entry) => sum + entry.amount, 0);
  const paymentExpense = state.payments.filter((entry) => entry.type === 'Expense' && entry.date === today).reduce((sum, entry) => sum + entry.amount, 0);
  const paymentIncome = state.payments.filter((entry) => entry.type === 'Income' && entry.date === today).reduce((sum, entry) => sum + entry.amount, 0);

  const totalIncome = income + paymentIncome;
  const totalExpense = expenses + paymentExpense;
  const profit = totalIncome - totalExpense;
  const allTransactions = getTransactionHistory();
  const lifetimeIncome = allTransactions.filter((entry) => entry.direction === 'income').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const lifetimeExpense = allTransactions.filter((entry) => entry.direction === 'expense').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  todayIncome.textContent = formatCurrency(totalIncome);
  todayExpenses.textContent = formatCurrency(totalExpense);
  todayProfit.textContent = formatCurrency(profit);
  currentBalance.textContent = formatCurrency(Number(state.business.openingBalance || 0) + lifetimeIncome - lifetimeExpense);

  const ledger = [...state.expenses, ...state.payments.map((item) => ({
    id: item.id,
    name: item.label,
    amount: item.amount,
    date: item.date,
    description: `Cash ${item.type}`
  }))].sort((a, b) => new Date(b.date) - new Date(a.date));
  const expenseQuery = expenseSearch.value.trim().toLowerCase();
  const visibleLedger = ledger.filter((entry) => !expenseQuery || `${entry.name} ${entry.description} ${entry.date}`.toLowerCase().includes(expenseQuery));
  document.getElementById('expense-total').textContent = formatCurrency(visibleLedger.reduce((sum, entry) => sum + Number(entry.amount || 0), 0));

  expenseHistoryBox.innerHTML = visibleLedger.length ? `
    <div class="list-header">
      <span>Name</span>
      <span>Date</span>
      <span>Amount</span>
      <span>Description</span>
    </div>
    ${visibleLedger.map((entry) => `
      <div class="list-row">
        <span>${entry.name}</span>
        <span>${formatDate(entry.date)}</span>
        <span>${formatCurrency(entry.amount)}</span>
        <span>${entry.description || '—'}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No ledger entries match your search.</div>';
  renderTransactionReport();
}

function getReportTransactions() {
  const type = reportType.value;
  const from = reportFrom.value ? new Date(`${reportFrom.value}T00:00:00`) : null;
  const to = reportTo.value ? new Date(`${reportTo.value}T23:59:59`) : null;
  return getTransactionHistory().filter((entry) => {
    const date = new Date(entry.date);
    return (!type || entry.type === type) && (!from || date >= from) && (!to || date <= to);
  });
}

function renderTransactionReport() {
  if (!reportResults || !reportSummary) return;
  const entries = getReportTransactions();
  const income = entries.filter((entry) => entry.direction === 'income').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const expense = entries.filter((entry) => entry.direction === 'expense').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  reportSummary.textContent = `${entries.length} transaction${entries.length === 1 ? '' : 's'} · Income ${formatCurrency(income)} · Expenses ${formatCurrency(expense)} · Net ${formatCurrency(income - expense)}`;
  reportResults.innerHTML = entries.length ? `
    <div class="list-header"><span>Date</span><span>Type</span><span>Description</span><span>Reference</span><span>Amount</span></div>
    ${entries.map((entry) => `<div class="list-row"><span>${formatDate(entry.date)}</span><span>${escapeHtml(entry.type)}</span><span>${escapeHtml(entry.label)}</span><span>${escapeHtml(entry.reference)}</span><span class="${entry.direction === 'income' ? 'income' : 'expense'}">${entry.direction === 'income' ? '+' : '-'}${formatCurrency(entry.amount)}</span></div>`).join('')}
  ` : '<div class="empty-state">No transactions match the selected filters.</div>';
}

function printTransactionReport() {
  const entries = getReportTransactions();
  if (!entries.length) {
    alert('There are no transactions matching the selected filters.');
    return;
  }
  const income = entries.filter((entry) => entry.direction === 'income').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const expense = entries.filter((entry) => entry.direction === 'expense').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    alert('Please allow pop-ups to print the report.');
    return;
  }
  const rows = entries.map((entry) => `<tr><td>${escapeHtml(formatDate(entry.date))}</td><td>${escapeHtml(entry.type)}</td><td>${escapeHtml(entry.label)}</td><td>${escapeHtml(entry.reference)}</td><td>${entry.direction === 'income' ? '+' : '-'}${escapeHtml(formatCurrency(entry.amount))}</td></tr>`).join('');
  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(state.business.name)} - Transaction Report</title><style>body{font-family:Arial,sans-serif;color:#18212f;padding:24px}h1{margin:0 0 4px}p{color:#64748b}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #dfe8f5;padding:9px;text-align:left}th{background:#eef4ff}.summary{font-weight:700;margin-top:16px}</style></head><body><h1>${escapeHtml(state.business.name)}</h1><p>Transaction report · Generated ${escapeHtml(formatDate(new Date().toISOString()))}</p><div class="summary">${entries.length} transactions · Income ${formatCurrency(income)} · Expenses ${formatCurrency(expense)} · Net ${formatCurrency(income - expense)}</div><table><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Reference</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script></body></html>`);
  printWindow.document.close();
}

function renderDeliveries() {
  const currentUser = getCurrentUser();
  const selectedStatus = deliveryFilterStatus.value;
  const selectedDriver = deliveryFilterDriver.value;
  const visibleDeliveries = state.deliveries
    .filter((delivery) => currentUser?.role !== 'delivery' || delivery.driverId === currentUser.id)
    .filter((delivery) => !deliveryFilterDate.value || (delivery.createdAt || '').startsWith(deliveryFilterDate.value))
    .filter((delivery) => !deliveryFilterStatus.value || delivery.status === deliveryFilterStatus.value)
    .filter((delivery) => !deliveryFilterDriver.value || delivery.driverId === deliveryFilterDriver.value)
    .filter((delivery) => {
      const query = deliveryFilterCustomer.value.trim().toLowerCase();
      return !query || `${delivery.customerName} ${delivery.phone}`.toLowerCase().includes(query);
    });

  deliveryBoardCount.textContent = `${visibleDeliveries.length} deliver${visibleDeliveries.length === 1 ? 'y' : 'ies'}`;
  deliveryFilterStatus.innerHTML = `<option value="">All statuses</option>${DELIVERY_STATUSES.map((status) => `<option value="${status}">${status}</option>`).join('')}`;
  deliveryFilterStatus.value = deliveryFilterStatus.value || '';
  const drivers = state.users.filter((user) => user.role === 'delivery' || user.role === 'sales');
  deliveryFilterDriver.innerHTML = `<option value="">All delivery people</option>${drivers.map((driver) => `<option value="${driver.id}">${escapeHtml(driver.displayName)}</option>`).join('')}`;
  deliveryFilterStatus.value = selectedStatus;
  deliveryFilterDriver.value = selectedDriver;

  deliverySummary.innerHTML = DELIVERY_STATUSES.map((status) => `<span class="delivery-summary-item"><strong>${state.deliveries.filter((delivery) => delivery.status === status).length}</strong>${status}</span>`).join('');
  document.getElementById('delivery-total').textContent = formatCurrency(visibleDeliveries.reduce((sum, delivery) => sum + Number(delivery.orderTotal || 0) + Number(delivery.fee || 0), 0));
  deliveryListBox.innerHTML = visibleDeliveries.length ? `
    <div class="delivery-board">
      ${visibleDeliveries.map((delivery) => renderDeliveryCard(delivery, currentUser)).join('')}
    </div>
  ` : '<div class="empty-state">No deliveries match the selected filters.</div>';
}

function renderDeliveryCard(delivery, currentUser) {
  const canSeePin = currentUser?.role !== 'delivery' || delivery.driverId === currentUser.id;
  return `<article class="delivery-card">
    <div class="delivery-card-head">
      <div><strong>DELIVERY #${escapeHtml(delivery.deliveryNo || delivery.id)}</strong><br><span class="text-muted">Sale ${escapeHtml(delivery.receiptNo || 'Not linked')} · ${formatDate(delivery.createdAt)}</span></div>
      <span class="delivery-status status-${slugify(delivery.status)}">${escapeHtml(delivery.status)}</span>
    </div>
    <div class="delivery-card-grid">
      <div><span class="label">Customer</span><strong>${escapeHtml(delivery.customerName)}</strong><span>${escapeHtml(delivery.phone || 'No phone')}</span></div>
      <div><span class="label">Address</span><strong>${escapeHtml(delivery.address || 'No address')}</strong></div>
      <div><span class="label">Order / Fee</span><strong>${formatCurrency(delivery.orderTotal)}</strong><span>Fee: ${formatCurrency(delivery.fee)}</span></div>
      <div><span class="label">Delivery Person</span><strong>${escapeHtml(delivery.driverName || 'Unassigned')}</strong>${canSeePin ? `<span>Customer PIN: <strong>${escapeHtml(delivery.pin)}</strong></span>` : ''}</div>
    </div>
    ${delivery.failureReason ? `<div class="delivery-failure"><strong>Failed:</strong> ${escapeHtml(delivery.failureReason)}${delivery.failureDescription ? ` · ${escapeHtml(delivery.failureDescription)}` : ''}</div>` : ''}
    <div class="delivery-card-foot"><span class="text-muted">${formatDeliveryTimeline(delivery)}</span><span class="action-controls">${renderDeliveryActions(delivery, currentUser)}</span></div>
  </article>`;
}

function renderDeliveryActions(delivery, currentUser) {
  const isAssigned = delivery.driverId === currentUser?.id;
  const isManager = hasRole('admin', 'sales');
  const canOperate = isManager || (currentUser?.role === 'delivery' && isAssigned);
  const actions = [];
  if (currentUser?.role === 'delivery') {
    if (isAssigned && ['On the Way', 'Arrived'].includes(delivery.status)) actions.push(actionButton('confirm', delivery.id, 'Enter Customer Code'));
    return actions.join('') || '<span class="text-muted">Waiting for delivery</span>';
  }
  if (isManager && !['Received', 'Delivered', 'Cancelled', 'Failed'].includes(delivery.status)) actions.push(`<button class="small-btn edit" data-delivery-action="assign" data-delivery-id="${delivery.id}">${delivery.driverId ? 'Reassign' : 'Assign'}</button>`);
  if (isManager && ['Pending', 'Preparing'].includes(delivery.status)) actions.push(actionButton('ready', delivery.id, 'Ready for Delivery'));
  if (isManager && delivery.status === 'Ready for Delivery') actions.push(actionButton('dispatch', delivery.id, 'Dispatch'));
  if (canOperate && delivery.status === 'Dispatched') actions.push(actionButton('start', delivery.id, 'Start Delivery'));
  if (canOperate && delivery.status === 'On the Way') actions.push(actionButton('arrive', delivery.id, "I've Arrived"));
  if (canOperate && delivery.status === 'Arrived') actions.push(actionButton('confirm', delivery.id, 'Confirm Delivery'));
  if (canOperate && !['Received', 'Delivered', 'Cancelled', 'Failed'].includes(delivery.status)) actions.push(`<button class="small-btn delete" data-delivery-action="fail" data-delivery-id="${delivery.id}">Mark Failed</button>`);
  return actions.join('') || '<span class="text-muted">No action</span>';
}

function actionButton(action, id, label) {
  return `<button class="small-btn success" data-delivery-action="${action}" data-delivery-id="${id}">${label}</button>`;
}

function formatDeliveryTimeline(delivery) {
  const timestamps = delivery.timestamps || {};
  const latest = Object.entries(timestamps).sort((a, b) => new Date(b[1]) - new Date(a[1]))[0];
  return latest ? `${latest[0].replace(/^./, (character) => character.toUpperCase())}: ${formatDate(latest[1])}` : 'No events recorded';
}

function handleDeliveryAction(action, deliveryId) {
  const delivery = state.deliveries.find((entry) => entry.id === deliveryId);
  const currentUser = getCurrentUser();
  if (!delivery) return;
  const isManager = hasRole('admin', 'sales');
  const isAssigned = delivery.driverId === currentUser?.id;
  if (action === 'assign') return openDeliveryModal(action, delivery);
  if (currentUser?.role === 'delivery' && !isAssigned) return alert('You can only manage deliveries assigned to you.');
  if (!isManager && currentUser?.role !== 'delivery') return alert('Your account is not authorized to update deliveries.');
  const nextStatus = { ready: 'Ready for Delivery', dispatch: 'Dispatched', start: 'On the Way', arrive: 'Arrived' }[action];
  if (nextStatus) return transitionDelivery(delivery, nextStatus);
  if (action === 'confirm' || action === 'fail') return openDeliveryModal(action, delivery);
}

function openDeliveryModal(action, delivery) {
  if (action === 'assign' && !hasRole('admin', 'sales')) return alert('Only managers can assign delivery people.');
  deliveryModalAction = action;
  deliveryModalDeliveryId = delivery.id;
  deliveryModalTitle.textContent = action === 'assign' ? 'Assign delivery person' : action === 'confirm' ? 'Confirm delivery' : 'Mark delivery failed';
  deliveryModalSubmit.textContent = action === 'assign' ? 'Assign' : action === 'confirm' ? 'Confirm Delivery' : 'Mark Failed';
  if (action === 'assign') {
    const drivers = state.users.filter((user) => user.role === 'delivery' || user.role === 'sales');
    deliveryModalFields.innerHTML = `<div class="field"><label for="delivery-driver-choice">Delivery Person</label><select id="delivery-driver-choice" required>${drivers.map((driver) => `<option value="${driver.id}" ${driver.id === delivery.driverId ? 'selected' : ''}>${escapeHtml(driver.displayName)}</option>`).join('')}</select></div>`;
  } else if (action === 'confirm') {
    deliveryModalFields.innerHTML = '<div class="field"><label for="delivery-pin-entry">Customer delivery code</label><input id="delivery-pin-entry" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autofocus /><small class="section-note">Ask the customer to show you the code from their delivery email.</small></div>';
  } else {
    deliveryModalFields.innerHTML = `<div class="field"><label for="delivery-failure-reason">Failure reason</label><select id="delivery-failure-reason" required>${DELIVERY_FAILURE_REASONS.map((reason) => `<option value="${reason}">${reason}</option>`).join('')}</select></div><div class="field" id="delivery-failure-description-field" hidden><label for="delivery-failure-description">Description</label><textarea id="delivery-failure-description" rows="3" placeholder="Describe the issue"></textarea></div>`;
  }
  deliveryModal.hidden = false;
}

function closeDeliveryModal() {
  deliveryModal.hidden = true;
  deliveryModalForm.reset();
  deliveryModalAction = '';
  deliveryModalDeliveryId = '';
}

async function submitDeliveryModal(event) {
  event.preventDefault();
  const delivery = state.deliveries.find((entry) => entry.id === deliveryModalDeliveryId);
  if (!delivery) return closeDeliveryModal();
  if (deliveryModalAction === 'assign') {
    const driver = state.users.find((user) => user.id === document.getElementById('delivery-driver-choice').value);
    if (driver) await assignDelivery(delivery, driver);
  } else if (deliveryModalAction === 'confirm') {
    if (!await confirmDelivery(delivery, document.getElementById('delivery-pin-entry').value.trim())) return;
  } else if (deliveryModalAction === 'fail') {
    await failDelivery(delivery, document.getElementById('delivery-failure-reason').value, document.getElementById('delivery-failure-description')?.value.trim() || '');
  }
  closeDeliveryModal();
}

async function assignDelivery(delivery, driver) {
  if (!hasRole('admin', 'sales')) return alert('Only managers can assign delivery people.');
  if (!driver) return;
  try {
    const response = await localRequest(`/deliveries/${delivery.id}`, { method: 'PATCH', body: JSON.stringify({ driver_id: driver.id }) });
    Object.assign(delivery, mapDelivery(response.delivery));
    renderDeliveries();
  } catch (error) { alert(error.message || 'Delivery assignment could not be saved.'); }
}

async function transitionDelivery(delivery, nextStatus) {
  const expectedNext = { Pending: 'Ready for Delivery', Preparing: 'Ready for Delivery', 'Ready for Delivery': 'Dispatched', Dispatched: 'On the Way', 'On the Way': 'Arrived' }[delivery.status];
  if (expectedNext !== nextStatus) return alert(`This delivery must move from ${delivery.status} to ${expectedNext || 'a final status'} first.`);
  if (nextStatus === 'Dispatched' && !delivery.driverId) return alert('Assign a delivery person before dispatching this order.');
  try {
    const response = await localRequest(`/deliveries/${delivery.id}`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus, timestamp_key: nextStatusTimestampKey(nextStatus) }) });
    Object.assign(delivery, mapDelivery(response.delivery));
    renderDeliveries();
    if (nextStatus === 'On the Way') sendDeliveryEmail(delivery, 'on-way');
  } catch (error) { alert(error.message || 'Delivery status could not be saved.'); }
}

async function confirmDelivery(delivery, enteredPin) {
  if (!['On the Way', 'Arrived'].includes(delivery.status)) {
    alert('The delivery must be On the Way before confirmation.');
    return false;
  }
  if (enteredPin !== delivery.pin) {
    alert('Incorrect delivery code. Delivery was not completed.');
    return false;
  }
  if (!confirm('The customer code is correct. Mark this delivery as delivered?')) return false;
  try {
    const response = await localRequest(`/deliveries/${delivery.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'Received', timestamp_key: 'received' }) });
    Object.assign(delivery, mapDelivery(response.delivery));
    renderDeliveries();
    sendDeliveryEmail(delivery, 'delivered');
    alert('Delivery confirmed successfully.');
    return true;
  } catch (error) { alert(error.message || 'Delivery confirmation could not be saved.'); return false; }
}

function sendDeliveryEmail(delivery, messageType) {
  if (!delivery.customerEmail) return;
  const sale = state.sales.find((entry) => entry.id === delivery.saleId);
  const items = sale?.items?.map((item) => `${item.name} x${item.qty} - ${formatCurrency(item.total)}`).join('\n') || 'Your ordered products are ready.';
  const subject = messageType === 'delivered' ? `Thank you for your SUUK POS order ${delivery.receiptNo || ''}` : `Your SUUK POS order ${delivery.receiptNo || ''} is on the way`;
  const body = messageType === 'delivered'
    ? `Hello ${delivery.customerName},\n\nThank you for receiving your order. We appreciate your business.\n\nOrder: ${delivery.receiptNo || delivery.deliveryNo}\n${items}`
    : `Hello ${delivery.customerName},\n\nYour order is on the way. Please show this delivery code to the delivery person when your order arrives:\n\nDELIVERY CODE: ${delivery.pin}\n\nOrder: ${delivery.receiptNo || delivery.deliveryNo}\n${items}\n\nTotal: ${formatCurrency(delivery.orderTotal)}`;
  window.location.href = `mailto:${encodeURIComponent(delivery.customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function failDelivery(delivery, selectedReason, description) {
  if (!selectedReason) return;
  if (selectedReason === 'Other' && !description) return alert('A description is required for Other.');
  try {
    const response = await localRequest(`/deliveries/${delivery.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'Failed', failure_reason: selectedReason, failure_description: description || '', timestamp_key: 'failed' }) });
    Object.assign(delivery, mapDelivery(response.delivery));
    renderDeliveries();
  } catch (error) { alert(error.message || 'Delivery failure could not be saved.'); }
}

function nextStatusTimestampKey(status) {
  return { 'Ready for Delivery': 'ready', Dispatched: 'dispatched', 'On the Way': 'started', Arrived: 'arrived' }[status];
}

function renderBadgeSummary() {
  const totalProducts = state.products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockCount = state.products.filter((product) => product.stock <= product.lowStockThreshold).length;
  liveStockBadge.textContent = totalProducts;
  lowStockBadge.textContent = lowStockCount;
}

function returnSale(saleId) {
  const sale = state.sales.find((entry) => entry.id === saleId);
  if (!sale) return;

  returnSaleId = saleId;
  document.getElementById('return-sale-message').textContent = `Return sale ${sale.receiptNo}? Inventory will be adjusted and the sale will be removed from active sales history.`;
  returnSaleModal.hidden = false;
}

function closeReturnSaleModal() {
  returnSaleId = '';
  returnSaleModal.hidden = true;
}

async function confirmReturnSale() {
  const sale = state.sales.find((entry) => entry.id === returnSaleId);
  if (!sale) return closeReturnSaleModal();
  try {
    await localRequest(`/sales/${sale.id}/return`, { method: 'POST' });
    await refreshLocalState();
    renderAll();
    closeReturnSaleModal();
    alert(`Returned sale ${sale.receiptNo}. Inventory adjusted.`);
  } catch (error) {
    alert(error.message || 'Sale return failed. Inventory was not changed.');
  }
}

function buildReceiptText(sale) {
  const soldItems = sale.items.map((item) => `${item.name} x${item.qty} @ ${formatCurrency(item.price)} = ${formatCurrency(item.total)}`).join('\n');
  return [
    state.business.name || 'SUUK POS',
    `Contact: ${state.business.phone || '—'}`,
    state.business.address ? `Address: ${state.business.address}` : '',
    '====================',
    `Receipt: ${sale.receiptNo}`,
    `Date: ${formatDate(sale.createdAt)}`,
    `Customer: ${sale.customerName}`,
    `Customer type: ${sale.customerType || 'Physical'}`,
    `Cashier: ${sale.cashierName || 'Admin'}`,
    'Items:',
    soldItems,
    `Subtotal: ${formatCurrency(sale.subtotal)}`,
    `Discount: ${formatCurrency(sale.discount)}`,
    sale.tax ? `Tax / VAT: ${formatCurrency(sale.tax)}` : '',
    `Total: ${formatCurrency(sale.total)}`,
    `Payment: ${formatPaymentReceiptLine(sale)}`,
    sale.paymentMethod === 'Credit' ? `Credit due: ${formatShortDate(sale.paymentDetails?.dueDate)}\nCredit customer: ${sale.paymentDetails?.name || '—'}\nCredit phone: ${sale.paymentDetails?.phone || '—'}` : '',
    sale.requiresDelivery ? `Delivery: Yes\nAddress: ${sale.deliveryAddress}\nDelivery fee: ${formatCurrency(sale.deliveryFee)}\nDelivery PIN: ${state.deliveries.find((delivery) => delivery.saleId === sale.id)?.pin || '—'}` : 'Delivery: No',
    'Thank you for your purchase.'
  ].join('\n');
}

function formatPaymentReceiptLine(sale) {
  if (sale.paymentMethod === 'Mobile Money') return `Mobile Money (${sale.paymentDetails?.network || '—'}) · Receiving: ${sale.paymentDetails?.receivingAccountName || '—'} · ${sale.paymentDetails?.receivingAccountPhone || '—'}${sale.paymentDetails?.transactionReference ? ` · Ref: ${sale.paymentDetails.transactionReference}` : ''}`;
  return sale.paymentMethod;
}

function printReceipt() {
  if (!lastReceiptText || lastReceiptText === 'No sale completed yet.') {
    alert('Complete a sale before printing a receipt.');
    return;
  }
  const paperSize = receiptPaperSize.value === 'a4' ? 'a4' : 'thermal';
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow pop-ups to print the receipt.');
    return;
  }
  const safeReceipt = escapeHtml(lastReceiptText);
  printWindow.document.write(`<!doctype html><html><head><title>Receipt</title><style>
    @page { size: ${paperSize === 'thermal' ? '80mm auto' : 'A4'}; margin: ${paperSize === 'thermal' ? '4mm' : '16mm'}; }
    * { box-sizing: border-box; } body { margin: 0; color: #111; font-family: ${paperSize === 'thermal' ? 'monospace' : 'Arial, sans-serif'}; }
    pre { white-space: pre-wrap; font-size: ${paperSize === 'thermal' ? '11px' : '14px'}; line-height: 1.45; margin: 0; }
  </style></head><body><pre>${safeReceipt}</pre><script>window.onload = function () { window.print(); window.onafterprint = function () { window.close(); }; };</script></body></html>`);
  printWindow.document.close();
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeDelivery(delivery) {
  const createdAt = delivery.createdAt || new Date().toISOString();
  const legacyStatus = { 'Out for Delivery': 'Dispatched' }[delivery.status] || delivery.status;
  return {
    ...delivery,
    deliveryNo: delivery.deliveryNo || `D${String(delivery.id || uid('del')).replace(/\D/g, '').slice(-6) || Date.now().toString().slice(-6)}`,
    status: DELIVERY_STATUSES.includes(legacyStatus) ? legacyStatus : 'Preparing',
    orderTotal: Number(delivery.orderTotal || 0),
    fee: Number(delivery.fee || 0),
    customerEmail: delivery.customerEmail || '',
    driverId: delivery.driverId || '',
    driverName: delivery.driverName || '',
    pin: delivery.pin || String(Math.floor(1000 + Math.random() * 9000)),
    createdAt,
    timestamps: { created: createdAt, ...(delivery.timestamps || {}) },
    failureReason: delivery.failureReason || '',
    failureDescription: delivery.failureDescription || ''
  };
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function formatCurrency(value) {
  return `${state.business?.currency || 'UGX'} ${Number(value || 0).toLocaleString('en-US')}`;
}

function formatRole(role) {
  return { owner: 'Business Owner', admin: 'Administrator', manager: 'Branch Manager', sales: 'Sales', purchase: 'Purchase & Inventory', delivery: 'Delivery Person' }[role] || role;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function formatShortDate(value) {
  if (!value) return 'Not set';
  return new Date(`${String(value).slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-UG', { dateStyle: 'medium' });
}

function formatExpiry(value) {
  if (!value) return 'Not set';
  const expiry = new Date(`${value}T00:00:00`);
  const daysRemaining = Math.ceil((expiry - new Date(new Date().toDateString())) / 86400000);
  if (daysRemaining < 0) return `Expired · ${formatShortDate(value)}`;
  if (daysRemaining <= 30) return `Soon · ${formatShortDate(value)}`;
  return formatShortDate(value);
}

function expiryClass(value) {
  if (!value) return 'text-muted';
  const expiry = new Date(`${value}T00:00:00`);
  const daysRemaining = Math.ceil((expiry - new Date(new Date().toDateString())) / 86400000);
  return daysRemaining < 0 ? 'expiry-danger' : daysRemaining <= 30 ? 'expiry-warning' : '';
}

function dateISO() {
  return new Date().toISOString().split('T')[0];
}

window.addEventListener('load', () => {
  receiptPreview.textContent = lastReceiptText;
  renderBadgeSummary();
});
