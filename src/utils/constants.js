// Category definitions with icons and colors
export const INITIAL_CATEGORIES = {
    Food: { icon: 'UtensilsCrossed', color: '#f59e0b' },
    Transport: { icon: 'Car', color: '#3b82f6' },
    Rent: { icon: 'Home', color: '#8b5cf6' },
    Utilities: { icon: 'Lightbulb', color: '#10b981' },
    Entertainment: { icon: 'Film', color: '#ec4899' },
    Savings: { icon: 'PiggyBank', color: '#059669' },
    Healthcare: { icon: 'Heart', color: '#ef4444' },
    Shopping: { icon: 'ShoppingBag', color: '#f97316' },
    Education: { icon: 'GraduationCap', color: '#6366f1' },
    Other: { icon: 'MoreHorizontal', color: '#64748b' }
}

export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense'
}

export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    INPUT: 'YYYY-MM-DD',
    FULL: 'MMMM DD, YYYY'
}

export const CHART_COLORS = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ef4444', // red
    '#f97316', // orange
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#64748b'  // slate
]

export const BUDGET_WARNING_THRESHOLD = 80
export const BUDGET_EXCEEDED_THRESHOLD = 100
