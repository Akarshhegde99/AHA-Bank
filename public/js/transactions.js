document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId');

    if (!accountId) {
        window.location.href = '/html/dashboard.html';
        return;
    }

    const mode = urlParams.get('mode');
    if (mode === 'history') {
        const forms = document.getElementById('transactionForms');
        if (forms) forms.classList.add('hidden');
    }

    const accTypeEl = document.getElementById('accType');
    const accNumberEl = document.getElementById('accNumber');
    const accBalanceEl = document.getElementById('accBalance');
    const historyBody = document.getElementById('transactionHistory');
    const depositForm = document.getElementById('depositForm');
    const withdrawForm = document.getElementById('withdrawForm');
    const toast = document.getElementById('toast');

    const showToast = (msg, type = 'success') => {
        toast.textContent = msg;
        toast.className = `fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium shadow-2xl ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    };

    const loadAccountData = async () => {
        try {
            const accRes = await fetch(`/api/accounts/${accountId}`);
            const accData = await accRes.json();

            if (accData.status === 'success') {
                const acc = accData.data.account;
                accTypeEl.textContent = acc.accountType;
                accNumberEl.textContent = acc.accountNumber;
                accBalanceEl.textContent = `₹${acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            }

            const transRes = await fetch(`/api/transactions/${accountId}`);
            const transData = await transRes.json();

            if (transData.status === 'success') {
                renderTransactions(transData.data.transactions);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderTransactions = (transactions) => {
        if (transactions.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="4" class="px-8 py-20 text-center"><div class="text-slate-400 font-bold">No transactions found</div><p class="text-slate-300 text-xs mt-1">Activity will appear here once you make a deposit or withdrawal.</p></td></tr>';
            return;
        }

        historyBody.innerHTML = transactions.map(t => `
            <tr class="hover:bg-slate-50/50 transition-colors duration-200">
                <td class="px-8 py-4">
                    <div class="text-sm font-bold text-slate-800">${new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                    <div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider">${new Date(t.createdAt).getFullYear()}</div>
                </td>
                <td class="px-8 py-4">
                    <div class="text-sm font-bold text-slate-800">${t.description || (t.type === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal')}</div>
                    <div class="text-xs font-medium text-slate-400">Electronic Transfer</div>
                </td>
                <td class="px-8 py-4">
                    <span class="px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${t.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${t.type}
                    </span>
                </td>
                <td class="px-8 py-4 text-right">
                    <div class="text-sm font-black ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}">
                        ${t.type === 'deposit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div class="text-[10px] font-bold text-slate-300 uppercase italic">Cleared</div>
                </td>
            </tr>
        `).join('');
    };

    depositForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('depositAmount').value;
        const description = document.getElementById('depositDesc').value;

        try {
            const res = await fetch('/api/transactions/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, amount, description })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToast('Deposit successful!');
                depositForm.reset();
                loadAccountData();
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Something went wrong', 'error');
        }
    });

    withdrawForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('withdrawAmount').value;
        const description = document.getElementById('withdrawDesc').value;

        try {
            const res = await fetch('/api/transactions/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, amount, description })
            });
            const data = await res.json();
            if (data.status === 'success') {
                showToast('Withdrawal successful!');
                withdrawForm.reset();
                loadAccountData();
            } else {
                showToast(data.message, 'error');
            }
        } catch (err) {
            showToast('Something went wrong', 'error');
        }
    });

    loadAccountData();
});
