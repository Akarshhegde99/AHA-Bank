document.addEventListener('DOMContentLoaded', async () => {
    const userNameEl = document.getElementById('userName');
    const accountsContainer = document.getElementById('accountsContainer');
    const openAccountBtn = document.getElementById('openAccountBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const createAccountForm = document.getElementById('createAccountForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // 1. Fetch User and Accounts
    const loadDashboard = async () => {
        try {
            const res = await fetch('/api/accounts');
            const data = await res.json();

            if (data.status === 'success') {
                renderAccounts(data.data.accounts);
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderAccounts = (accounts) => {
        if (accounts.length === 0) {
            accountsContainer.innerHTML = `
                <div class="col-span-full text-center py-20 card-premium border-dashed border-2 bg-slate-50/50">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <p class="text-slate-500 font-bold text-lg">Your portfolio is empty</p>
                    <p class="text-slate-400 text-sm mt-1">Open your first account to get started with digital banking.</p>
                </div>
            `;
            return;
        }

        accountsContainer.innerHTML = accounts.map(acc => {
            const isSavings = acc.accountType === 'Savings';
            const isFD = acc.accountType === 'Fixed Deposit';
            const icon = isSavings ?
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>';

            return `
                <div class="card-premium p-6 flex flex-col animate-fade-in group">
                    <div class="flex justify-between items-start mb-8">
                        <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                            <svg class="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${icon}
                            </svg>
                        </div>
                        <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest ${acc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'} rounded-full">
                            ${acc.status}
                        </span>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-2xl font-black text-slate-800 tracking-tight mb-1">₹${acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${acc.accountType}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span class="text-xs font-medium text-slate-500">${acc.accountNumber}</span>
                        </div>
                    </div>
                    
                    <div class="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                        <a href="/html/transactions.html?accountId=${acc._id}&mode=history" class="btn-secondary py-2 text-xs flex items-center justify-center gap-2">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                             History
                        </a>
                        <button onclick="openTransactionModal('${acc._id}')" class="btn-primary py-2 text-xs gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Transact
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    };

    // 2. Event Listeners
    openAccountBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));

    createAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const accountType = document.getElementById('accountType').value;

        try {
            const res = await fetch('/api/accounts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType })
            });

            const data = await res.json();
            if (data.status === 'success') {
                modal.classList.add('hidden');
                loadDashboard();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await fetch('/api/auth/logout');
        window.location.href = '/';
    });

    loadDashboard();
});

// To be used by global scope for onclick handlers
window.openTransactionModal = (accountId) => {
    window.location.href = `/html/transactions.html?accountId=${accountId}&mode=transact`;
};
