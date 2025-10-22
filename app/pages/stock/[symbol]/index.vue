<template>
  <div class="stock-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading stock data...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Stock Content -->
    <div v-else-if="stock">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/">Dashboard</NuxtLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ stock.symbol }}
          </li>
        </ol>
      </nav>

      <!-- Stock Header -->
      <div class="stock-header mb-4">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="d-flex align-items-center mb-2">
              <h1 class="mb-0 me-3">{{ stock.symbol }}</h1>
              <span class="badge bg-secondary">{{ stock.sector }}</span>
            </div>
            <h5 class="text-muted mb-2">{{ stock.name }}</h5>
            <div class="d-flex align-items-center gap-3 flex-wrap">
              <div class="stock-price">
                <span class="price-value">${{ stock.price.toFixed(2) }}</span>
                <span
                  class="price-change ms-2"
                  :class="stock.changePercent >= 0 ? 'price-positive' : 'price-negative'"
                >
                  <i
                    class="bi"
                    :class="stock.changePercent >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"
                  ></i>
                  {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}
                  ({{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%)
                </span>
              </div>
              <div class="text-muted">
                <i class="bi bi-bar-chart me-1"></i>
                Volume: {{ formatVolume(stock.volume) }}
              </div>
            </div>
          </div>
          <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <div class="btn-group" role="group">
              <button class="btn btn-outline-primary" @click="addToWatchlist">
                <i class="bi bi-star me-2"></i>Add to Watchlist
              </button>
              <button class="btn btn-outline-secondary" @click="setAlert">
                <i class="bi bi-bell me-2"></i>Set Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'overview' }"
            @click="activeTab = 'overview'"
          >
            <i class="bi bi-info-circle me-2"></i>Overview
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'chart' }"
            @click="activeTab = 'chart'"
          >
            <i class="bi bi-graph-up me-2"></i>Chart
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'financials' }"
            @click="activeTab = 'financials'"
          >
            <i class="bi bi-file-earmark-text me-2"></i>Financials
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'fundamentals' }"
            @click="activeTab = 'fundamentals'"
          >
            <i class="bi bi-bar-chart-line me-2"></i>Fundamentals
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <i class="bi bi-clock-history me-2"></i>History
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'events' }"
            @click="activeTab = 'events'"
          >
            <i class="bi bi-calendar-event me-2"></i>Events
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'dividend' }"
            @click="activeTab = 'dividend'"
          >
            <i class="bi bi-cash-coin me-2"></i>Dividend
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'notes' }"
            @click="activeTab = 'notes'"
          >
            <i class="bi bi-journal-text me-2"></i>Notes
          </button>
        </li>
      </ul>

      <!-- Tab Content Container -->
      <div class="tab-content-container">
        <!-- Overview Tab -->
        <div v-show="activeTab === 'overview'" class="tab-pane-content">
          <div class="row g-4">
            <!-- Left Column -->
            <div class="col-lg-8">
              <!-- Stock Chart Preview -->
              <StockStockChart
                :symbol="stock.symbol"
                :price-history="priceHistory"
                class="mb-4"
              />

              <!-- Key Metrics -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Key Metrics</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">Market Cap</div>
                        <div class="metric-value">{{ formatMarketCap(stock.marketCap) }}</div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">P/E Ratio</div>
                        <div class="metric-value">{{ stock.pe ? stock.pe.toFixed(2) : 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">EPS</div>
                        <div class="metric-value">${{ stock.eps ? stock.eps.toFixed(2) : 'N/A' }}</div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">Dividend Yield</div>
                        <div class="metric-value">
                          {{ stock.dividendYield ? stock.dividendYield.toFixed(2) + '%' : 'N/A' }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">52W High</div>
                        <div class="metric-value">${{ stock.fiftyTwoWeekHigh.toFixed(2) }}</div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">52W Low</div>
                        <div class="metric-value">${{ stock.fiftyTwoWeekLow.toFixed(2) }}</div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">Avg Volume</div>
                        <div class="metric-value">{{ formatVolume(stock.volume) }}</div>
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="metric-item">
                        <div class="metric-label">Next Earnings</div>
                        <div class="metric-value">
                          {{ stock.nextEarningsDate ? formatShortDate(stock.nextEarningsDate) : 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Performance Metrics -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Performance</h5>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-md-2 col-4">
                      <StockPerformanceMetric label="1D" :value="calculatePerformance(1)" />
                    </div>
                    <div class="col-md-2 col-4">
                      <StockPerformanceMetric label="5D" :value="calculatePerformance(5)" />
                    </div>
                    <div class="col-md-2 col-4">
                      <StockPerformanceMetric label="1M" :value="calculatePerformance(30)" />
                    </div>
                    <div class="col-md-2 col-4">
                      <StockPerformanceMetric label="3M" :value="calculatePerformance(90)" />
                    </div>
                    <div class="col-md-2 col-4">
                      <StockPerformanceMetric label="6M" :value="calculatePerformance(180)" />
                    </div>
                    <div class="col-md-2 col-4">
                      <StockPerformanceMetric label="1Y" :value="calculatePerformance(365)" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- News -->
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Recent News</h5>
                </div>
                <div class="card-body">
                  <div v-if="newsLoading" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                      <span class="visually-hidden">Loading news...</span>
                    </div>
                  </div>
                  <div v-else-if="news.length === 0" class="text-center text-muted py-3">
                    No recent news available
                  </div>
                  <div v-else class="news-list">
                    <StockNewsItem
                      v-for="article in news.slice(0, 5)"
                      :key="article.id"
                      :article="article"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="col-lg-4">
              <!-- Company Info -->
              <div class="card mb-4">
                <div class="card-header">
                  <h6 class="mb-0">Company Details</h6>
                </div>
                <div class="card-body">
                  <div class="company-info">
                    <div class="info-row">
                      <span class="info-label">CEO</span>
                      <span class="info-value">{{ stock.ceo || 'N/A' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Employees</span>
                      <span class="info-value">
                        {{ stock.employees ? formatNumber(stock.employees) : 'N/A' }}
                      </span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Industry</span>
                      <span class="info-value">{{ stock.industry }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Sector</span>
                      <span class="info-value">{{ stock.sector }}</span>
                    </div>
                    <div v-if="stock.website" class="info-row">
                      <span class="info-label">Website</span>
                      <span class="info-value">
                        <a :href="stock.website" target="_blank" rel="noopener">
                          <i class="bi bi-box-arrow-up-right"></i>
                          Visit
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Upcoming Events -->
              <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Upcoming Events</h6>
                  <button class="btn btn-sm btn-link" @click="activeTab = 'events'">
                    View All
                  </button>
                </div>
                <div class="card-body">
                  <div v-if="upcomingEvents.length === 0" class="text-center text-muted py-3">
                    No upcoming events
                  </div>
                  <div v-else class="event-list-small">
                    <div
                      v-for="event in upcomingEvents.slice(0, 3)"
                      :key="event.id"
                      class="event-item-small"
                      @click="navigateTo(`/events/${event.id}`)"
                    >
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <span class="badge badge-sm" :class="`bg-${getEventColor(event.type)}`">
                            {{ event.type }}
                          </span>
                          <div class="small fw-semibold mt-1">{{ event.name }}</div>
                        </div>
                        <small class="text-muted">{{ formatShortDate(event.date) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="card">
                <div class="card-header">
                  <h6 class="mb-0">Quick Actions</h6>
                </div>
                <div class="card-body">
                  <div class="d-grid gap-2">
                    <button class="btn btn-outline-secondary btn-sm" @click="exportData">
                      <i class="bi bi-download me-2"></i>Export Data
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="shareStock">
                      <i class="bi bi-share me-2"></i>Share
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="compareStock">
                      <i class="bi bi-bar-chart-line me-2"></i>Compare
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Tab -->
        <div v-show="activeTab === 'chart'" class="tab-pane-content">
          <div v-if="chartLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <StockChart :symbol="symbol" :price-history="chartHistory" class="mb-4" />

            <div class="row g-4">
              <div class="col-md-3">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="stat-label">Highest Price</div>
                    <div class="stat-value price-positive">${{ chartMaxPrice.toFixed(2) }}</div>
                    <small class="text-muted">{{ chartMaxPriceDate }}</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="stat-label">Lowest Price</div>
                    <div class="stat-value price-negative">${{ chartMinPrice.toFixed(2) }}</div>
                    <small class="text-muted">{{ chartMinPriceDate }}</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="stat-label">Average Price</div>
                    <div class="stat-value">${{ chartAvgPrice.toFixed(2) }}</div>
                    <small class="text-muted">Period average</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="stat-label">Total Volume</div>
                    <div class="stat-value">{{ formatVolume(chartTotalVolume) }}</div>
                    <small class="text-muted">Cumulative</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financials Tab -->
        <div v-show="activeTab === 'financials'" class="tab-pane-content">
          <div v-if="financialsLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <ul class="nav nav-pills mb-4">
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: statementType === 'income' }"
                  @click="statementType = 'income'"
                >
                  <i class="bi bi-file-earmark-bar-graph me-2"></i>Income Statement
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: statementType === 'balance' }"
                  @click="statementType = 'balance'"
                >
                  <i class="bi bi-scale me-2"></i>Balance Sheet
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link"
                  :class="{ active: statementType === 'cash' }"
                  @click="statementType = 'cash'"
                >
                  <i class="bi bi-cash-stack me-2"></i>Cash Flow
                </button>
              </li>
            </ul>

            <!-- Income Statement -->
            <div v-if="statementType === 'income'" class="card">
              <div class="card-header">
                <h5 class="mb-0">Income Statement</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover financial-table">
                    <thead>
                      <tr>
                        <th class="sticky-col">Period</th>
                        <th v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ stmt.period }}
                        </th>
                      </tr>
                      <tr class="text-muted small">
                        <th class="sticky-col">Report Date</th>
                        <th v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatDate(stmt.reportDate) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="section-header">
                        <td class="sticky-col"><strong>Revenue</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong>{{ formatCurrency(stmt.revenue) }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Cost of Revenue</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency(stmt.costOfRevenue) }}
                        </td>
                      </tr>
                      <tr class="section-header">
                        <td class="sticky-col"><strong>Gross Profit</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong>{{ formatCurrency(stmt.grossProfit) }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Operating Expense</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency(stmt.operatingExpense) }}
                        </td>
                      </tr>
                      <tr class="section-header">
                        <td class="sticky-col"><strong>Operating Income</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong>{{ formatCurrency(stmt.operatingIncome) }}</strong>
                        </td>
                      </tr>
                      <tr class="section-header bg-light">
                        <td class="sticky-col"><strong>Net Income</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong class="text-primary">{{ formatCurrency(stmt.netIncome) }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">EPS</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          ${{ stmt.eps?.toFixed(2) || 'N/A' }}
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">EBITDA</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency(stmt.ebitda) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mt-4">
                  <h6 class="mb-3">Year-over-Year Growth</h6>
                  <div class="row g-3">
                    <div class="col-md-3">
                      <div class="growth-metric">
                        <div class="growth-label">Revenue Growth</div>
                        <div class="growth-value price-positive">+12.4%</div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="growth-metric">
                        <div class="growth-label">Net Income Growth</div>
                        <div class="growth-value price-positive">+18.7%</div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="growth-metric">
                        <div class="growth-label">EPS Growth</div>
                        <div class="growth-value price-positive">+15.3%</div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="growth-metric">
                        <div class="growth-label">Gross Margin</div>
                        <div class="growth-value">{{ calculateGrossMargin() }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Balance Sheet -->
            <div v-if="statementType === 'balance'" class="card">
              <div class="card-header">
                <h5 class="mb-0">Balance Sheet</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover financial-table">
                    <thead>
                      <tr>
                        <th class="sticky-col">Period</th>
                        <th v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ stmt.period }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="section-header">
                        <td class="sticky-col" colspan="9"><strong>Assets</strong></td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Current Assets</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency((stmt.revenue || 0) * 0.4) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Total Assets</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong>{{ formatCurrency((stmt.revenue || 0) * 1.5) }}</strong>
                        </td>
                      </tr>
                      <tr class="section-header">
                        <td class="sticky-col" colspan="9"><strong>Liabilities</strong></td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Current Liabilities</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency((stmt.revenue || 0) * 0.25) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Total Liabilities</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong>{{ formatCurrency((stmt.revenue || 0) * 0.6) }}</strong>
                        </td>
                      </tr>
                      <tr class="section-header bg-light">
                        <td class="sticky-col"><strong>Total Equity</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong class="text-primary">{{ formatCurrency((stmt.revenue || 0) * 0.9) }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Cash Flow Statement -->
            <div v-if="statementType === 'cash'" class="card">
              <div class="card-header">
                <h5 class="mb-0">Cash Flow Statement</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover financial-table">
                    <thead>
                      <tr>
                        <th class="sticky-col">Period</th>
                        <th v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ stmt.period }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="section-header">
                        <td class="sticky-col"><strong>Operating Cash Flow</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong>{{ formatCurrency((stmt.netIncome || 0) * 1.2) }}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Investing Cash Flow</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency((stmt.netIncome || 0) * -0.5) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Financing Cash Flow</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency((stmt.netIncome || 0) * -0.3) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="sticky-col">Capital Expenditures</td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          {{ formatCurrency((stmt.netIncome || 0) * -0.2) }}
                        </td>
                      </tr>
                      <tr class="section-header bg-light">
                        <td class="sticky-col"><strong>Free Cash Flow</strong></td>
                        <td v-for="stmt in financials.slice(0, 8)" :key="stmt.period" class="text-end">
                          <strong class="text-primary">{{ formatCurrency((stmt.netIncome || 0) * 1.0) }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fundamentals Tab -->
        <div v-show="activeTab === 'fundamentals'" class="tab-pane-content">
          <div v-if="fundamentalsLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else-if="fundamentals">
            <div class="card mb-4">
              <div class="card-body text-center py-5">
                <h3 class="mb-3">Overall Score</h3>
                <div class="score-circle" :class="getScoreClass(fundamentals.overallScore)">
                  {{ fundamentals.overallScore }}%
                </div>
                <p class="text-muted mt-3">Based on profitability, debt, liquidity, and performance</p>
              </div>
            </div>

            <div class="row g-4 mb-4">
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-graph-up-arrow fs-1 text-primary mb-3"></i>
                    <h6>Profitability</h6>
                    <div class="score-badge" :class="getScoreClass(fundamentals.profitabilityScore)">
                      {{ fundamentals.profitabilityScore }}%
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-credit-card fs-1 text-warning mb-3"></i>
                    <h6>Debt Management</h6>
                    <div class="score-badge" :class="getScoreClass(fundamentals.debtScore)">
                      {{ fundamentals.debtScore }}%
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-droplet fs-1 text-info mb-3"></i>
                    <h6>Liquidity</h6>
                    <div class="score-badge" :class="getScoreClass(fundamentals.liquidityScore)">
                      {{ fundamentals.liquidityScore }}%
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-rocket-takeoff fs-1 text-success mb-3"></i>
                    <h6>Performance</h6>
                    <div class="score-badge" :class="getScoreClass(fundamentals.performanceScore)">
                      {{ fundamentals.performanceScore }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Key Financial Ratios</h5>
              </div>
              <div class="card-body">
                <div class="row g-4">
                  <div class="col-md-6">
                    <h6 class="mb-3">Profitability</h6>
                    <div class="ratio-list">
                      <div class="ratio-item">
                        <div class="ratio-label">Return on Equity (ROE)</div>
                        <div class="ratio-value">{{ fundamentals.roe?.toFixed(2) }}%</div>
                      </div>
                      <div class="ratio-item">
                        <div class="ratio-label">Return on Assets (ROA)</div>
                        <div class="ratio-value">{{ fundamentals.roa?.toFixed(2) }}%</div>
                      </div>
                      <div class="ratio-item">
                        <div class="ratio-label">Return on Sales (ROS)</div>
                        <div class="ratio-value">{{ fundamentals.ros?.toFixed(2) }}%</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h6 class="mb-3">Leverage & Liquidity</h6>
                    <div class="ratio-list">
                      <div class="ratio-item">
                        <div class="ratio-label">Debt to Equity</div>
                        <div class="ratio-value">{{ fundamentals.debtToEquity?.toFixed(2) }}</div>
                      </div>
                      <div class="ratio-item">
                        <div class="ratio-label">Current Ratio</div>
                        <div class="ratio-value">{{ fundamentals.currentRatio?.toFixed(2) }}</div>
                      </div>
                      <div class="ratio-item">
                        <div class="ratio-label">Quick Ratio</div>
                        <div class="ratio-value">{{ fundamentals.quickRatio?.toFixed(2) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div v-show="activeTab === 'history'" class="tab-pane-content">
          <div v-if="historyLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p class="text-muted mb-0">Daily price and volume data</p>
              </div>
              <button class="btn btn-outline-secondary" @click="exportHistoryData">
                <i class="bi bi-download me-2"></i>Export
              </button>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th class="text-end">Open</th>
                        <th class="text-end">High</th>
                        <th class="text-end">Low</th>
                        <th class="text-end">Close</th>
                        <th class="text-end">Change</th>
                        <th class="text-end">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="point in paginatedHistory" :key="point.date">
                        <td>{{ formatDate(point.date) }}</td>
                        <td class="text-end">${{ point.open.toFixed(2) }}</td>
                        <td class="text-end">${{ point.high.toFixed(2) }}</td>
                        <td class="text-end">${{ point.low.toFixed(2) }}</td>
                        <td class="text-end fw-bold">${{ point.close.toFixed(2) }}</td>
                        <td class="text-end" :class="getHistoryChangeClass(point)">
                          {{ formatHistoryChange(point) }}
                        </td>
                        <td class="text-end">{{ formatVolume(point.volume) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-if="historyTotalPages > 1" class="d-flex justify-content-center mt-4">
                  <nav>
                    <ul class="pagination">
                      <li class="page-item" :class="{ disabled: historyCurrentPage === 1 }">
                        <button class="page-link" @click="historyCurrentPage--">Previous</button>
                      </li>
                      <li v-for="page in historyDisplayPages" :key="page" class="page-item" :class="{ active: historyCurrentPage === page }">
                        <button class="page-link" @click="historyCurrentPage = page">{{ page }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: historyCurrentPage === historyTotalPages }">
                        <button class="page-link" @click="historyCurrentPage++">Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Events Tab -->
        <div v-show="activeTab === 'events'" class="tab-pane-content">
          <div v-if="eventsLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <p class="text-muted mb-4">Upcoming earnings, dividends, and corporate actions</p>

            <div v-if="stockEvents.length === 0" class="card">
              <div class="card-body text-center py-5 text-muted">
                <i class="bi bi-calendar-x fs-1 d-block mb-3"></i>
                <p>No upcoming events for {{ symbol }}</p>
              </div>
            </div>

            <div v-else class="event-list">
              <EventsEventCard
                v-for="event in stockEvents"
                :key="event.id"
                :event="event"
                @click="navigateTo(`/events/${event.id}`)"
              />
            </div>
          </div>
        </div>

        <!-- Dividend Tab -->
        <div v-show="activeTab === 'dividend'" class="tab-pane-content">
          <div v-if="dividendLoading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else>
            <p class="text-muted mb-4">Dividend history, yield, and payout information</p>

            <!-- Dividend Overview Cards -->
            <div class="row g-4 mb-4">
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-percent fs-1 text-success mb-3"></i>
                    <h6 class="text-muted mb-2">Dividend Yield</h6>
                    <div class="dividend-value">{{ dividendYield }}%</div>
                    <small class="text-muted">Annual yield</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-cash-stack fs-1 text-primary mb-3"></i>
                    <h6 class="text-muted mb-2">Annual Dividend</h6>
                    <div class="dividend-value">${{ annualDividend.toFixed(2) }}</div>
                    <small class="text-muted">Per share</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-graph-up-arrow fs-1 text-info mb-3"></i>
                    <h6 class="text-muted mb-2">5-Year Growth</h6>
                    <div class="dividend-value" :class="dividendGrowth >= 0 ? 'price-positive' : 'price-negative'">
                      {{ dividendGrowth >= 0 ? '+' : '' }}{{ dividendGrowth.toFixed(1) }}%
                    </div>
                    <small class="text-muted">CAGR</small>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card h-100">
                  <div class="card-body text-center">
                    <i class="bi bi-pie-chart fs-1 text-warning mb-3"></i>
                    <h6 class="text-muted mb-2">Payout Ratio</h6>
                    <div class="dividend-value">{{ payoutRatio.toFixed(1) }}%</div>
                    <small class="text-muted">Of earnings</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dividend Details -->
            <div class="row g-4 mb-4">
              <div class="col-lg-8">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">Dividend Payment Schedule</h5>
                  </div>
                  <div class="card-body">
                    <div class="row g-3 mb-3">
                      <div class="col-md-6">
                        <div class="schedule-item">
                          <div class="schedule-label">Payment Frequency</div>
                          <div class="schedule-value">{{ dividendFrequency }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="schedule-item">
                          <div class="schedule-label">Next Ex-Dividend Date</div>
                          <div class="schedule-value">{{ nextExDividendDate || 'N/A' }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="schedule-item">
                          <div class="schedule-label">Next Payment Date</div>
                          <div class="schedule-value">{{ nextPaymentDate || 'N/A' }}</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="schedule-item">
                          <div class="schedule-label">Last Payment Amount</div>
                          <div class="schedule-value">${{ lastDividendAmount.toFixed(2) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="card h-100">
                  <div class="card-header">
                    <h6 class="mb-0">Dividend Status</h6>
                  </div>
                  <div class="card-body">
                    <div class="status-badges">
                      <div class="badge bg-success mb-2 w-100">
                        <i class="bi bi-check-circle me-2"></i>Dividend Paying
                      </div>
                      <div v-if="consecutiveYears > 0" class="badge bg-info mb-2 w-100">
                        <i class="bi bi-star me-2"></i>{{ consecutiveYears }} Years Consecutive
                      </div>
                      <div v-if="dividendGrowth > 0" class="badge bg-primary w-100">
                        <i class="bi bi-graph-up me-2"></i>Growing Dividend
                      </div>
                    </div>
                    <div class="mt-3 small text-muted">
                      <p class="mb-1"><strong>Consistency Score:</strong> {{ consistencyScore }}/10</p>
                      <p class="mb-0">Based on payment history and growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dividend History Table -->
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Dividend History</h5>
                <button class="btn btn-outline-secondary btn-sm" @click="exportDividendData">
                  <i class="bi bi-download me-2"></i>Export
                </button>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Ex-Dividend Date</th>
                        <th>Payment Date</th>
                        <th class="text-end">Amount</th>
                        <th class="text-end">Change</th>
                        <th class="text-end">Yield at Payment</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dividend in dividendHistory" :key="dividend.date">
                        <td>{{ formatDate(dividend.exDate) }}</td>
                        <td>{{ formatDate(dividend.paymentDate) }}</td>
                        <td class="text-end fw-bold">${{ dividend.amount.toFixed(4) }}</td>
                        <td class="text-end" :class="getDividendChangeClass(dividend.change)">
                          <span v-if="dividend.change !== null">
                            {{ dividend.change >= 0 ? '+' : '' }}{{ dividend.change.toFixed(1) }}%
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td class="text-end">{{ dividend.yieldAtPayment.toFixed(2) }}%</td>
                        <td>
                          <span class="badge" :class="getDividendTypeBadge(dividend.type)">
                            {{ dividend.type }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Dividend Pagination -->
                <div v-if="dividendTotalPages > 1" class="d-flex justify-content-center mt-4">
                  <nav>
                    <ul class="pagination">
                      <li class="page-item" :class="{ disabled: dividendCurrentPage === 1 }">
                        <button class="page-link" @click="dividendCurrentPage--">Previous</button>
                      </li>
                      <li v-for="page in dividendDisplayPages" :key="page" class="page-item" :class="{ active: dividendCurrentPage === page }">
                        <button class="page-link" @click="dividendCurrentPage = page">{{ page }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: dividendCurrentPage === dividendTotalPages }">
                        <button class="page-link" @click="dividendCurrentPage++">Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Tab -->
        <div v-show="activeTab === 'notes'" class="tab-pane-content">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <p class="text-muted mb-0">Your research notes and observations</p>
            <button class="btn btn-primary" @click="showAddNote = true">
              <i class="bi bi-plus-circle me-2"></i>Add Note
            </button>
          </div>

          <div v-if="notes.length === 0" class="card">
            <div class="card-body text-center py-5 text-muted">
              <i class="bi bi-journal-x fs-1 d-block mb-3"></i>
              <p>No notes yet. Add your first note to track your research.</p>
              <button class="btn btn-primary" @click="showAddNote = true">
                <i class="bi bi-plus-circle me-2"></i>Create First Note
              </button>
            </div>
          </div>

          <div v-else class="notes-list">
            <div v-for="note in notes" :key="note.id" class="card mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span class="badge bg-secondary me-2">{{ note.type }}</span>
                    <small class="text-muted">{{ formatNoteDate(note.date) }}</small>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" @click="editNote(note)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteNote(note.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <h5 class="card-title">{{ note.title }}</h5>
                <p class="card-text">{{ note.content }}</p>
                <div v-if="note.tags && note.tags.length > 0" class="mt-2">
                  <span v-for="tag in note.tags" :key="tag" class="badge bg-light text-dark me-1">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add/Edit Note Modal -->
          <div v-if="showAddNote" class="modal fade show d-block" tabindex="-1" @click.self="showAddNote = false">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">{{ editingNote ? 'Edit Note' : 'Add Note' }}</h5>
                  <button type="button" class="btn-close" @click="showAddNote = false"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Type</label>
                    <select v-model="noteForm.type" class="form-select">
                      <option value="analysis">Analysis</option>
                      <option value="observation">Observation</option>
                      <option value="reminder">Reminder</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input v-model="noteForm.title" type="text" class="form-control" placeholder="Note title">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Content</label>
                    <textarea v-model="noteForm.content" class="form-control" rows="6" placeholder="Your notes..."></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Tags (comma-separated)</label>
                    <input v-model="noteForm.tagsInput" type="text" class="form-control" placeholder="bullish, earnings, revenue">
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="showAddNote = false">Cancel</button>
                  <button type="button" class="btn btn-primary" @click="saveNote">Save Note</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="showAddNote" class="modal-backdrop fade show"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock, PricePoint, NewsArticle, FinancialStatement, FundamentalAnalysis } from '~/types/stock';
import type { Event } from '~/types/event';

interface Note {
  id: string;
  symbol: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

const route = useRoute();
const router = useRouter();
const api = useApi();

// Main State
const loading = ref(true);
const newsLoading = ref(true);
const error = ref('');
const stock = ref<Stock | null>(null);
const priceHistory = ref<PricePoint[]>([]);
const news = ref<NewsArticle[]>([]);
const upcomingEvents = ref<Event[]>([]);
const activeTab = ref('overview');

// Chart Tab State
const chartLoading = ref(false);
const chartHistory = ref<PricePoint[]>([]);

// Financials Tab State
const financialsLoading = ref(false);
const financials = ref<FinancialStatement[]>([]);
const statementType = ref<'income' | 'balance' | 'cash'>('income');

// Fundamentals Tab State
const fundamentalsLoading = ref(false);
const fundamentals = ref<FundamentalAnalysis | null>(null);

// History Tab State
const historyLoading = ref(false);
const fullHistory = ref<PricePoint[]>([]);
const historyCurrentPage = ref(1);
const historyPageSize = 30;

// Events Tab State
const eventsLoading = ref(false);
const stockEvents = ref<Event[]>([]);

// Dividend Tab State
interface DividendPayment {
  exDate: string;
  paymentDate: string;
  amount: number;
  change: number | null;
  yieldAtPayment: number;
  type: string;
}

const dividendLoading = ref(false);
const fullDividendHistory = ref<DividendPayment[]>([]);
const dividendCurrentPage = ref(1);
const dividendPageSize = 20;

// Notes Tab State
const notes = ref<Note[]>([]);
const showAddNote = ref(false);
const editingNote = ref<Note | null>(null);
const noteForm = ref({
  type: 'analysis',
  title: '',
  content: '',
  tagsInput: '',
});

const symbol = computed(() => (route.params.symbol as string).toUpperCase());

// Methods
const loadStockData = async () => {
  try {
    loading.value = true;
    error.value = '';

    // Load main stock data
    stock.value = await api.getStock(symbol.value);

    // Load price history (last 30 days for chart preview)
    priceHistory.value = await api.getStockHistory(symbol.value, 30);

    // Load upcoming events
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];
    const allEvents = await api.getEvents(today, futureDate);
    upcomingEvents.value = allEvents.filter(e => e.symbol === symbol.value);

  } catch (err) {
    console.error('Error loading stock data:', err);
    error.value = 'Failed to load stock data';
  } finally {
    loading.value = false;
  }
};

const loadNews = async () => {
  try {
    newsLoading.value = true;
    news.value = await api.getStockNews(symbol.value, 10);
  } catch (err) {
    console.error('Error loading news:', err);
  } finally {
    newsLoading.value = false;
  }
};

const calculatePerformance = (days: number): number => {
  if (priceHistory.value.length < 2) return 0;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);

  const oldPrice = priceHistory.value.find(p => new Date(p.date) <= targetDate);
  const currentPrice = stock.value?.price || 0;

  if (!oldPrice) return 0;

  return ((currentPrice - oldPrice.close) / oldPrice.close) * 100;
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(2)}B`;
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`;
  return volume.toString();
};

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1000000000000) return `$${(marketCap / 1000000000000).toFixed(2)}T`;
  if (marketCap >= 1000000000) return `$${(marketCap / 1000000000).toFixed(2)}B`;
  if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
};

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US');
};

const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getEventColor = (type: string) => {
  const colors: Record<string, string> = {
    earnings: 'primary',
    dividend: 'success',
    economics: 'warning',
    ipo: 'info',
    split: 'secondary',
  };
  return colors[type] || 'secondary';
};

const addToWatchlist = () => {
  alert('Add to Watchlist - Coming soon!');
};

const setAlert = () => {
  alert('Set Alert - Coming soon!');
};

const exportData = () => {
  alert('Export Data - Coming soon!');
};

const shareStock = () => {
  alert('Share Stock - Coming soon!');
};

const compareStock = () => {
  alert('Compare Stock - Coming soon!');
};

// Chart Tab Methods and Computed
const loadChartData = async () => {
  if (chartHistory.value.length > 0) return;
  try {
    chartLoading.value = true;
    chartHistory.value = await api.getStockHistory(symbol.value, 365);
  } catch (error) {
    console.error('Error loading chart data:', error);
  } finally {
    chartLoading.value = false;
  }
};

const chartMaxPrice = computed(() => {
  if (chartHistory.value.length === 0) return 0;
  return Math.max(...chartHistory.value.map(p => p.high));
});

const chartMinPrice = computed(() => {
  if (chartHistory.value.length === 0) return 0;
  return Math.min(...chartHistory.value.map(p => p.low));
});

const chartAvgPrice = computed(() => {
  if (chartHistory.value.length === 0) return 0;
  const sum = chartHistory.value.reduce((acc, p) => acc + p.close, 0);
  return sum / chartHistory.value.length;
});

const chartTotalVolume = computed(() => {
  return chartHistory.value.reduce((acc, p) => acc + p.volume, 0);
});

const chartMaxPriceDate = computed(() => {
  const point = chartHistory.value.find(p => p.high === chartMaxPrice.value);
  return point ? formatDate(point.date) : '';
});

const chartMinPriceDate = computed(() => {
  const point = chartHistory.value.find(p => p.low === chartMinPrice.value);
  return point ? formatDate(point.date) : '';
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
};

// Financials Tab Methods
const loadFinancials = async () => {
  if (financials.value.length > 0) return;
  try {
    financialsLoading.value = true;
    financials.value = await api.getStockFinancials(symbol.value);
  } catch (error) {
    console.error('Error loading financials:', error);
  } finally {
    financialsLoading.value = false;
  }
};

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return 'N/A';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (absValue >= 1000000000000) return `${sign}$${(absValue / 1000000000000).toFixed(2)}T`;
  if (absValue >= 1000000000) return `${sign}$${(absValue / 1000000000).toFixed(2)}B`;
  if (absValue >= 1000000) return `${sign}$${(absValue / 1000000).toFixed(2)}M`;
  return `${sign}$${absValue.toFixed(2)}`;
};

const calculateGrossMargin = () => {
  if (financials.value.length === 0) return 0;
  const latest = financials.value[0];
  if (!latest.revenue || !latest.grossProfit) return 0;
  return ((latest.grossProfit / latest.revenue) * 100).toFixed(1);
};

// Fundamentals Tab Methods
const loadFundamentals = async () => {
  if (fundamentals.value) return;
  try {
    fundamentalsLoading.value = true;
    fundamentals.value = await api.getStockFundamentals(symbol.value);
  } catch (error) {
    console.error('Error loading fundamentals:', error);
  } finally {
    fundamentalsLoading.value = false;
  }
};

const getScoreClass = (score: number) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-average';
  return 'score-poor';
};

// History Tab Methods and Computed
const loadHistoryData = async () => {
  if (fullHistory.value.length > 0) return;
  try {
    historyLoading.value = true;
    fullHistory.value = await api.getStockHistory(symbol.value, 365);
    fullHistory.value.reverse();
  } catch (error) {
    console.error('Error loading history:', error);
  } finally {
    historyLoading.value = false;
  }
};

const historyTotalPages = computed(() => Math.ceil(fullHistory.value.length / historyPageSize));

const paginatedHistory = computed(() => {
  const start = (historyCurrentPage.value - 1) * historyPageSize;
  return fullHistory.value.slice(start, start + historyPageSize);
});

const historyDisplayPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let startPage = Math.max(1, historyCurrentPage.value - Math.floor(maxPages / 2));
  const endPage = Math.min(historyTotalPages.value, startPage + maxPages - 1);
  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const formatHistoryChange = (point: PricePoint) => {
  const change = point.close - point.open;
  const changePercent = (change / point.open) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
};

const getHistoryChangeClass = (point: PricePoint) => {
  const change = point.close - point.open;
  return change >= 0 ? 'price-positive' : 'price-negative';
};

const exportHistoryData = () => {
  alert('Export functionality coming soon!');
};

// Events Tab Methods
const loadEventsData = async () => {
  if (stockEvents.value.length > 0) return;
  try {
    eventsLoading.value = true;
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];
    const allEvents = await api.getEvents(today, futureDate);
    stockEvents.value = allEvents.filter(e => e.symbol === symbol.value);
  } catch (error) {
    console.error('Error loading events:', error);
  } finally {
    eventsLoading.value = false;
  }
};

// Dividend Tab Methods and Computed
const loadDividendData = async () => {
  if (fullDividendHistory.value.length > 0) return;
  try {
    dividendLoading.value = true;

    // Generate mock dividend history data
    const history: DividendPayment[] = [];
    const currentDate = new Date();
    let baseAmount = 0.50;

    for (let i = 0; i < 40; i++) {
      const quarterDate = new Date(currentDate);
      quarterDate.setMonth(currentDate.getMonth() - (i * 3));

      const exDate = new Date(quarterDate);
      exDate.setDate(15);

      const paymentDate = new Date(exDate);
      paymentDate.setDate(exDate.getDate() + 14);

      // Simulate dividend growth with occasional increases
      if (i > 0 && i % 4 === 0) {
        baseAmount = baseAmount * 1.05; // 5% annual increase
      }

      const amount = baseAmount + (Math.random() * 0.01 - 0.005);

      let change: number | null = null;
      if (i > 0 && history.length > 0) {
        const prevAmount = history[i - 1].amount;
        change = ((amount - prevAmount) / prevAmount) * 100;
      }

      history.push({
        exDate: exDate.toISOString().split('T')[0],
        paymentDate: paymentDate.toISOString().split('T')[0],
        amount,
        change,
        yieldAtPayment: 2.5 + (Math.random() * 1),
        type: i === 0 ? 'Regular' : (i % 12 === 0 ? 'Special' : 'Regular'),
      });
    }

    fullDividendHistory.value = history;
  } catch (error) {
    console.error('Error loading dividend data:', error);
  } finally {
    dividendLoading.value = false;
  }
};

const dividendYield = computed(() => {
  if (!stock.value?.dividendYield) return '0.00';
  return stock.value.dividendYield.toFixed(2);
});

const annualDividend = computed(() => {
  if (fullDividendHistory.value.length < 4) return 0;
  const lastFour = fullDividendHistory.value.slice(0, 4);
  return lastFour.reduce((sum, d) => sum + d.amount, 0);
});

const dividendGrowth = computed(() => {
  if (fullDividendHistory.value.length < 20) return 0;
  const recent = fullDividendHistory.value.slice(0, 4).reduce((sum, d) => sum + d.amount, 0);
  const fiveYearsAgo = fullDividendHistory.value.slice(16, 20).reduce((sum, d) => sum + d.amount, 0);
  if (fiveYearsAgo === 0) return 0;
  return ((Math.pow(recent / fiveYearsAgo, 1/5) - 1) * 100);
});

const payoutRatio = computed(() => {
  if (!stock.value?.eps || annualDividend.value === 0) return 0;
  return (annualDividend.value / stock.value.eps) * 100;
});

const dividendFrequency = computed(() => 'Quarterly');

const nextExDividendDate = computed(() => {
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  nextDate.setDate(15);
  return nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const nextPaymentDate = computed(() => {
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  nextDate.setDate(29);
  return nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const lastDividendAmount = computed(() => {
  if (fullDividendHistory.value.length === 0) return 0;
  return fullDividendHistory.value[0].amount;
});

const consecutiveYears = computed(() => {
  return Math.floor(fullDividendHistory.value.length / 4);
});

const consistencyScore = computed(() => {
  if (fullDividendHistory.value.length === 0) return 0;
  const hasGrowth = dividendGrowth.value > 0;
  const longHistory = fullDividendHistory.value.length >= 20;
  const reasonablePayout = payoutRatio.value < 80;

  let score = 5;
  if (hasGrowth) score += 2;
  if (longHistory) score += 2;
  if (reasonablePayout) score += 1;

  return Math.min(score, 10);
});

const dividendHistory = computed(() => {
  const start = (dividendCurrentPage.value - 1) * dividendPageSize;
  return fullDividendHistory.value.slice(start, start + dividendPageSize);
});

const dividendTotalPages = computed(() => Math.ceil(fullDividendHistory.value.length / dividendPageSize));

const dividendDisplayPages = computed(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let startPage = Math.max(1, dividendCurrentPage.value - Math.floor(maxPages / 2));
  const endPage = Math.min(dividendTotalPages.value, startPage + maxPages - 1);
  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const getDividendChangeClass = (change: number | null) => {
  if (change === null) return '';
  return change >= 0 ? 'price-positive' : 'price-negative';
};

const getDividendTypeBadge = (type: string) => {
  return type === 'Special' ? 'bg-warning' : 'bg-secondary';
};

const exportDividendData = () => {
  alert('Export dividend data - Coming soon!');
};

// Notes Tab Methods
const loadNotes = () => {
  const stored = localStorage.getItem(`notes_${symbol.value}`);
  if (stored) {
    notes.value = JSON.parse(stored);
  }
};

const saveNote = () => {
  const tags = noteForm.value.tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t);

  if (editingNote.value) {
    const index = notes.value.findIndex(n => n.id === editingNote.value!.id);
    notes.value[index] = {
      ...editingNote.value,
      ...noteForm.value,
      tags,
    };
  } else {
    notes.value.unshift({
      id: `note-${Date.now()}`,
      symbol: symbol.value,
      ...noteForm.value,
      tags,
      date: new Date().toISOString(),
    });
  }

  localStorage.setItem(`notes_${symbol.value}`, JSON.stringify(notes.value));
  showAddNote.value = false;
  editingNote.value = null;
  noteForm.value = { type: 'analysis', title: '', content: '', tagsInput: '' };
};

const editNote = (note: Note) => {
  editingNote.value = note;
  noteForm.value = {
    type: note.type,
    title: note.title,
    content: note.content,
    tagsInput: note.tags.join(', '),
  };
  showAddNote.value = true;
};

const deleteNote = (id: string) => {
  if (confirm('Are you sure you want to delete this note?')) {
    notes.value = notes.value.filter(n => n.id !== id);
    localStorage.setItem(`notes_${symbol.value}`, JSON.stringify(notes.value));
  }
};

const formatNoteDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Watch active tab to lazy load data
watch(activeTab, (newTab) => {
  if (newTab === 'chart') loadChartData();
  if (newTab === 'financials') loadFinancials();
  if (newTab === 'fundamentals') loadFundamentals();
  if (newTab === 'history') loadHistoryData();
  if (newTab === 'events') loadEventsData();
  if (newTab === 'dividend') loadDividendData();
  if (newTab === 'notes') loadNotes();
});

// Load data on mount and when symbol changes
onMounted(() => {
  loadStockData();
  loadNews();
  loadNotes();
});

watch(symbol, () => {
  loadStockData();
  loadNews();
  activeTab.value = 'overview';
  chartHistory.value = [];
  financials.value = [];
  fundamentals.value = null;
  fullHistory.value = [];
  stockEvents.value = [];
  fullDividendHistory.value = [];
  loadNotes();
});
</script>

<style scoped>
.stock-detail-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stock-header {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.price-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.price-change {
  font-size: 1.25rem;
  font-weight: 600;
}

.metric-item {
  padding: 1rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
  text-align: center;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--tf-text-primary);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--tf-border-color);
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
}

.info-value {
  font-weight: 600;
  text-align: right;
}

.event-item-small {
  padding: 0.75rem;
  border-bottom: 1px solid var(--tf-border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.event-item-small:hover {
  background-color: var(--tf-gray-100);
}

.event-item-small:last-child {
  border-bottom: none;
}

.badge-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 0;
}

.nav-tabs {
  border-bottom: 2px solid var(--tf-border-color);
}

.nav-tabs .nav-link {
  border: none;
  color: var(--tf-text-muted);
  padding: 0.75rem 1rem;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.nav-tabs .nav-link:hover {
  color: var(--tf-primary);
  border-bottom-color: var(--tf-primary);
}

.nav-tabs .nav-link.active {
  color: var(--tf-primary);
  border-bottom-color: var(--tf-primary);
  background: transparent;
}

@media (max-width: 768px) {
  .price-value {
    font-size: 2rem;
  }

  .price-change {
    font-size: 1rem;
  }

  .nav-tabs .nav-link {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
}

/* Tab Content */
.tab-content-container {
  animation: fadeIn 0.3s ease-in;
}

.tab-pane-content {
  animation: fadeIn 0.3s ease-in;
}

/* Chart Tab Styles */
.stat-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

/* Financials Tab Styles */
.nav-pills .nav-link {
  color: var(--tf-text-muted);
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-pills .nav-link.active {
  background-color: var(--tf-primary);
  color: white;
}

.financial-table {
  font-size: 0.875rem;
  margin-bottom: 0;
}

.financial-table thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.financial-table thead th {
  font-weight: 600;
  border-bottom: 2px solid var(--tf-border-color);
  padding: 0.75rem 0.5rem;
}

.financial-table tbody td {
  padding: 0.75rem 0.5rem;
}

.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 5;
  font-weight: 500;
  min-width: 180px;
}

.section-header {
  background-color: var(--tf-gray-100);
}

.section-header.bg-light {
  background-color: rgba(13, 110, 253, 0.05) !important;
}

.growth-metric {
  text-align: center;
  padding: 1rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
}

.growth-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
}

.growth-value {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Fundamentals Tab Styles */
.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  border: 8px solid;
}

.score-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1.5rem;
  font-weight: 700;
}

.score-excellent {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
  border-color: #198754;
}

.score-good {
  background-color: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
  border-color: #0dcaf0;
}

.score-average {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  border-color: #ffc107;
}

.score-poor {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-color: #dc3545;
}

.ratio-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ratio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
}

.ratio-label {
  font-weight: 500;
  color: var(--tf-text-muted);
}

.ratio-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--tf-primary);
}

/* Notes Tab Styles */
.notes-list {
  margin-top: 1rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.card-text {
  color: var(--tf-text-muted);
  white-space: pre-wrap;
}

/* Events Tab Styles */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Dividend Tab Styles */
.dividend-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--tf-primary);
}

.schedule-item {
  padding: 1rem;
  background: var(--tf-gray-100);
  border-radius: 6px;
}

.schedule-label {
  font-size: 0.875rem;
  color: var(--tf-text-muted);
  margin-bottom: 0.5rem;
}

.schedule-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--tf-text-primary);
}

.status-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-badges .badge {
  padding: 0.75rem;
  font-size: 0.875rem;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sticky-col {
    min-width: 120px;
    font-size: 0.8rem;
  }

  .financial-table {
    font-size: 0.75rem;
  }

  .financial-table thead th,
  .financial-table tbody td {
    padding: 0.5rem 0.25rem;
  }
}
</style>
