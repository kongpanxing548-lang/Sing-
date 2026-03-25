// ASTRASONIC 筛选功能模块

(function() {
    // 筛选状态
    let activeFilters = {};
    
    // 初始化
    function init() {
        // 绑定标签点击事件
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', toggleFilter);
        });
        
        // 绑定搜索输入
        const searchInput = document.getElementById('topSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        
        // 初始统计卡片数量
        updateFilterCount();
    }
    
    // 切换筛选标签
    function toggleFilter(e) {
        const tag = e.target;
        const filterType = tag.dataset.filter;
        const filterValue = tag.dataset.value;
        
        if (!filterType || !filterValue) return;
        
        if (!activeFilters[filterType]) {
            activeFilters[filterType] = new Set();
        }
        
        if (activeFilters[filterType].has(filterValue)) {
            activeFilters[filterType].delete(filterValue);
            tag.classList.remove('active');
        } else {
            activeFilters[filterType].add(filterValue);
            tag.classList.add('active');
        }
        
        applyFilters();
    }
    
    // 应用筛选
    function applyFilters() {
        const cards = document.querySelectorAll('.card');
        const searchInput = document.getElementById('topSearchInput');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        let visibleCount = 0;
        
        cards.forEach(card => {
            let matches = true;
            
            // 标签筛选
            for (const [type, values] of Object.entries(activeFilters)) {
                if (values.size === 0) continue;
                
                const cardValue = card.dataset[type];
                if (!cardValue || !values.has(cardValue)) {
                    matches = false;
                    break;
                }
            }
            
            // 搜索筛选
            if (searchTerm && !card.textContent.toLowerCase().includes(searchTerm)) {
                matches = false;
            }
            
            if (matches) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        updateFilterUI(visibleCount);
    }
    
    // 更新筛选 UI
    function updateFilterCount() {
        const cards = document.querySelectorAll('.card');
        updateFilterUI(cards.length);
    }
    
    function updateFilterUI(visibleCount) {
        const filterStatus = document.getElementById('filterStatus');
        const filterCount = document.getElementById('filterCount');
        const activeTags = document.getElementById('activeTags');
        const noResult = document.getElementById('noResult');
        const cardSections = document.querySelectorAll('.section');
        
        // 更新计数
        if (filterCount) {
            filterCount.textContent = visibleCount;
        }
        
        // 更新已选标签
        if (activeTags) {
            activeTags.innerHTML = '';
            for (const [type, values] of Object.entries(activeFilters)) {
                values.forEach(value => {
                    const tagEl = document.createElement('div');
                    tagEl.className = 'active-tag';
                    tagEl.innerHTML = `${value} <span class="remove" onclick="window.filterModule.removeFilter('${type}','${value}')">×</span>`;
                    activeTags.appendChild(tagEl);
                });
            }
        }
        
        // 显示/隐藏状态栏
        const hasFilters = Object.values(activeFilters).some(v => v.size > 0) || 
                          (document.getElementById('topSearchInput') && document.getElementById('topSearchInput').value);
        
        if (filterStatus) {
            filterStatus.classList.toggle('visible', hasFilters);
        }
        
        // 显示/隐藏无结果提示
        if (noResult) {
            noResult.classList.toggle('visible', visibleCount === 0);
        }
        
        // 隐藏没有可见卡片的 section
        cardSections.forEach(section => {
            const visibleCards = section.querySelectorAll('.card:not(.hidden)');
            section.style.display = visibleCards.length === 0 ? 'none' : '';
        });
    }
    
    // 移除单个筛选
    window.removeFilter = function(type, value) {
        if (activeFilters[type]) {
            activeFilters[type].delete(value);
            const tag = document.querySelector(`.filter-tag[data-filter="${type}"][data-value="${value}"]`);
            if (tag) tag.classList.remove('active');
        }
        applyFilters();
    };
    
    // 清除全部筛选
    window.clearAllFilters = function() {
        activeFilters = {};
        document.querySelectorAll('.filter-tag.active').forEach(tag => {
            tag.classList.remove('active');
        });
        const searchInput = document.getElementById('topSearchInput');
        if (searchInput) searchInput.value = '';
        applyFilters();
    };
    
    // 导出模块
    window.filterModule = {
        init: init,
        removeFilter: window.removeFilter,
        clearAllFilters: window.clearAllFilters
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
