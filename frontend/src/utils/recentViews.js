export const trackRecentView = (userId, item) => {
    if (!userId) return;
    const key = `recent_designs_${userId}`;
    const recent = JSON.parse(localStorage.getItem(key) || '[]');

    // Remove if already exists (to move to top)
    const filtered = recent.filter(i => i.id !== item.id);

    const newItem = {
        ...item,
        viewedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newItem, ...filtered].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
};
