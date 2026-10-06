#![allow(non_snake_case)]

mod state;
mod theme;

use dioxus::prelude::*;
use papper_cutter_domain::{
    calculate_equal_split, calculate_group_balances, generate_settlement_plan, Category, Expense,
    Money, SettlementStatus, SplitType,
};
use state::{AppState, AppTab, GroupSubTab};
use std::collections::HashMap;

fn main() {
    launch(App);
}

#[component]
fn App() -> Element {
    let state = use_signal(AppState::default);

    rsx! {
        // Embed Warm Pastel Harmony stylesheet
        style { {include_str!("../assets/style.css")} }

        div { class: "android-device-shell",
            // Android top status bar
            StatusBar {}

            // Main scrollable content area
            main { class: "app-screen-content",
                match state.read().active_tab {
                    AppTab::Home => rsx! { HomeView { state } },
                    AppTab::Groups => rsx! { GroupDetailView { state } },
                    AppTab::Expenses => rsx! { AllExpensesView { state } },
                    AppTab::Profile => rsx! { ProfileView { state } },
                }
            }

            // Android pill navigation bar
            NavBar { state }

            // Add Expense Bottom Sheet Modal
            if state.read().is_add_expense_open {
                AddExpenseSheet { state }
            }
        }
    }
}

#[component]
fn StatusBar() -> Element {
    rsx! {
        div { class: "android-status-bar",
            span { "09:41" }
            div { class: "camera-cutout" }
            div { style: "display: flex; gap: 6px; align-items: center;",
                span { "5G" }
                span { "📶" }
                span { "🔋 98%" }
            }
        }
    }
}

#[component]
fn NavBar(mut state: Signal<AppState>) -> Element {
    let active = state.read().active_tab;

    rsx! {
        nav { class: "android-nav-bar",
            button {
                class: if active == AppTab::Home { "nav-item active" } else { "nav-item" },
                onclick: move |_| state.write().active_tab = AppTab::Home,
                span { "🏠" }
                span { "Home" }
            }
            button {
                class: if active == AppTab::Groups { "nav-item active" } else { "nav-item" },
                onclick: move |_| state.write().active_tab = AppTab::Groups,
                span { "👥" }
                span { "Groups" }
            }
            // Quick Add Floating Pill Button
            button {
                class: "nav-item-center",
                onclick: move |_| state.write().is_add_expense_open = true,
                span { "+" }
            }
            button {
                class: if active == AppTab::Expenses { "nav-item active" } else { "nav-item" },
                onclick: move |_| state.write().active_tab = AppTab::Expenses,
                span { "💸" }
                span { "Expenses" }
            }
            button {
                class: if active == AppTab::Profile { "nav-item active" } else { "nav-item" },
                onclick: move |_| state.write().active_tab = AppTab::Profile,
                span { "👤" }
                span { "Profile" }
            }
        }
    }
}

#[component]
fn HomeView(mut state: Signal<AppState>) -> Element {
    let s = state.read();
    let current_user = &s.current_user_id;

    // Calculate overall user net balance across all expenses
    let mut total_net = Money::ZERO;
    let selected_group = s.groups.iter().find(|g| g.id == s.selected_group_id).cloned();

    if let Some(ref grp) = selected_group {
        let balances = calculate_group_balances(&grp.members, &s.expenses, &s.settlements);
        if let Some(mb) = balances.get(current_user) {
            total_net = mb.net_balance;
        }
    }

    let is_owed = total_net.paise() >= 0;

    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 4px;",
            // Top Welcome Header
            div { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; margin-top: 4px;",
                div {
                    p { style: "font-size: 13px; color: var(--text-muted); font-weight: 500;", "Good morning 👋" }
                    h2 { style: "font-size: 20px; font-weight: 700; color: var(--text-main);", "Harsh Sharma" }
                }
                div { style: "width: 40px; height: 40px; border-radius: 50%; background: #E5DEFF; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary-dark); font-size: 15px;",
                    "HS"
                }
            }

            // Group Balance Cushion Card
            div { class: "balance-cushion",
                p { style: "font-size: 13px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;",
                    "Your Net Balance"
                }
                div {
                    class: "balance-amount",
                    style: if is_owed { "color: var(--credit-text);" } else { "color: var(--debt-text);" },
                    "{total_net}"
                }
                div {
                    class: if is_owed { "pill-badge credit" } else { "pill-badge debt" },
                    if is_owed {
                        span { "🟢 You are owed across groups" }
                    } else {
                        span { "🔴 You owe group members" }
                    }
                }

                // Quick Action Buttons
                div { style: "display: flex; gap: 10px; margin-top: 18px;",
                    button {
                        class: "btn-primary",
                        onclick: move |_| {
                            state.write().active_tab = AppTab::Groups;
                            state.write().group_sub_tab = GroupSubTab::Settle;
                        },
                        span { "⚡ Settle Up" }
                    }
                    button {
                        class: "btn-secondary",
                        style: "flex: 1; justify-content: center;",
                        onclick: move |_| {
                            state.write().active_tab = AppTab::Groups;
                            state.write().group_sub_tab = GroupSubTab::Analytics;
                        },
                        span { "📊 Analytics" }
                    }
                }
            }

            // Active Groups Carousel
            div { style: "margin-bottom: 20px;",
                div { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;",
                    h3 { style: "font-size: 16px; font-weight: 700;", "Active Groups" }
                    span { style: "font-size: 12px; color: var(--primary); font-weight: 600; cursor: pointer;", "See All (3)" }
                }
                div { style: "display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px;",
                    for grp in &s.groups {
                        div {
                            class: "warm-card",
                            style: "min-width: 170px; margin-bottom: 0; padding: 14px; cursor: pointer; transition: transform 0.15s ease;",
                            onclick: {
                                let gid = grp.id.clone();
                                move |_| {
                                    state.write().selected_group_id = gid.clone();
                                    state.write().active_tab = AppTab::Groups;
                                }
                            },
                            div { style: "font-size: 24px; margin-bottom: 6px;",
                                if grp.name.contains("Manali") { "🏔️" }
                                else if grp.name.contains("Room") { "🏠" }
                                else { "🎉" }
                            }
                            h4 { style: "font-size: 14px; font-weight: 700; margin-bottom: 2px;", "{grp.name}" }
                            p { style: "font-size: 11px; color: var(--text-muted);", "{grp.members.len()} members" }
                        }
                    }
                }
            }

            // Recent Expenses List
            div {
                div { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;",
                    h3 { style: "font-size: 16px; font-weight: 700;", "Recent Expenses" }
                    span { style: "font-size: 12px; color: var(--primary); font-weight: 600;", "Manali Trip" }
                }
                div { style: "display: flex; flex-direction: column; gap: 10px;",
                    for exp in s.expenses.iter().take(4) {
                        div { class: "warm-card", style: "margin-bottom: 0; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;",
                            div { style: "display: flex; align-items: center; gap: 12px;",
                                div { style: "width: 42px; height: 42px; border-radius: 14px; background: var(--surface-low); display: flex; align-items: center; justify-content: center; font-size: 20px;",
                                    "{exp.category.emoji()}"
                                }
                                div {
                                    h4 { style: "font-size: 14px; font-weight: 700; margin-bottom: 2px;", "{exp.description}" }
                                    p { style: "font-size: 12px; color: var(--text-muted);",
                                        "Paid by "
                                        strong { "{exp.paid_by}" }
                                        " • {exp.date}"
                                    }
                                }
                            }
                            div { style: "text-align: right;",
                                span { style: "font-size: 15px; font-weight: 700;", "{exp.amount}" }
                                p { style: "font-size: 11px; color: var(--primary); font-weight: 600;", "Equal split" }
                            }
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn GroupDetailView(mut state: Signal<AppState>) -> Element {
    let s = state.read();
    let sub_tab = s.group_sub_tab;
    let grp = s.groups.iter().find(|g| g.id == s.selected_group_id).cloned();

    let Some(grp) = grp else {
        return rsx! { div { "Group not found" } };
    };

    let balances = calculate_group_balances(&grp.members, &s.expenses, &s.settlements);
    let total_spent: Money = s.expenses.iter().map(|e| e.amount).fold(Money::ZERO, |a, b| a + b);

    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 12px;",
            // Group Pulse Header Card
            div { class: "warm-card", style: "background: linear-gradient(135deg, #FFF8F4 0%, #F5F0FF 100%); margin-bottom: 8px;",
                div { style: "display: flex; justify-content: space-between; align-items: flex-start;",
                    div {
                        h2 { style: "font-size: 22px; font-weight: 800; margin-bottom: 4px;", "{grp.name}" }
                        p { style: "font-size: 12px; color: var(--text-muted);", "{grp.members.len()} members • Created Oct 01" }
                    }
                    div { class: "pill-badge", style: "background: white; border: 1px solid var(--surface-border);",
                        "🏔️ Trip"
                    }
                }
                div { style: "display: flex; justify-content: space-between; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(239, 232, 223, 0.8);",
                    div {
                        p { style: "font-size: 11px; color: var(--text-muted); font-weight: 600;", "TOTAL SPENT" }
                        p { style: "font-size: 20px; font-weight: 800; color: var(--text-main);", "{total_spent}" }
                    }
                    div { style: "text-align: right;",
                        p { style: "font-size: 11px; color: var(--text-muted); font-weight: 600;", "YOUR SHARE" }
                        p { style: "font-size: 20px; font-weight: 800; color: var(--primary);",
                            if let Some(mb) = balances.get(&s.current_user_id) {
                                "{mb.total_share}"
                            } else {
                                "₹0.00"
                            }
                        }
                    }
                }
            }

            // Pill Tabs (Expenses, Balances, Settle, Analytics)
            div { style: "display: flex; gap: 6px; background: var(--surface-high); padding: 4px; border-radius: var(--radius-pill); overflow-x: auto;",
                for (tab, label) in [
                    (GroupSubTab::Expenses, "Expenses"),
                    (GroupSubTab::Balances, "Balances"),
                    (GroupSubTab::Settle, "Smart Settle"),
                    (GroupSubTab::Analytics, "Analytics"),
                ] {
                    button {
                        style: if sub_tab == tab {
                            "flex: 1; padding: 8px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: none; background: white; color: var(--primary); box-shadow: var(--shadow-sm);"
                        } else {
                            "flex: 1; padding: 8px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; border: none; background: transparent; color: var(--text-muted);"
                        },
                        onclick: move |_| state.write().group_sub_tab = tab,
                        "{label}"
                    }
                }
            }

            // Subtab Content
            match sub_tab {
                GroupSubTab::Expenses => rsx! { GroupExpensesTab { state } },
                GroupSubTab::Balances => rsx! { GroupBalancesTab { balances } },
                GroupSubTab::Settle => rsx! { SmartSettleTab { state, grp_id: grp.id.clone(), balances } },
                GroupSubTab::Analytics => rsx! { GroupAnalyticsTab { expenses: s.expenses.clone() } },
                GroupSubTab::Members => rsx! { div { "Members List" } },
            }
        }
    }
}

#[component]
fn GroupExpensesTab(mut state: Signal<AppState>) -> Element {
    let s = state.read();
    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 10px; margin-top: 4px;",
            for exp in &s.expenses {
                div { class: "warm-card", style: "padding: 14px 16px; margin-bottom: 0;",
                    div { style: "display: flex; justify-content: space-between; align-items: center;",
                        div { style: "display: flex; align-items: center; gap: 12px;",
                            div { style: "width: 40px; height: 40px; border-radius: 12px; background: var(--surface-low); display: flex; align-items: center; justify-content: center; font-size: 18px;",
                                "{exp.category.emoji()}"
                            }
                            div {
                                h4 { style: "font-size: 14px; font-weight: 700;", "{exp.description}" }
                                p { style: "font-size: 12px; color: var(--text-muted);", "Paid by {exp.paid_by} • {exp.date}" }
                            }
                        }
                        div { style: "text-align: right;",
                            p { style: "font-size: 15px; font-weight: 800;", "{exp.amount}" }
                            p { style: "font-size: 11px; color: var(--text-muted);", "{exp.participants.len()} people" }
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn GroupBalancesTab(balances: HashMap<String, papper_cutter_domain::MemberBalance>) -> Element {
    let mut sorted_balances: Vec<_> = balances.into_iter().collect();
    sorted_balances.sort_by(|a, b| b.1.net_balance.cmp(&a.1.net_balance));

    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 10px; margin-top: 4px;",
            for (uid, mb) in sorted_balances {
                {
                    let is_pos = mb.net_balance.paise() > 0;
                    let is_zero = mb.net_balance.is_zero();
                    let badge_class: &'static str = if is_pos {
                        "pill-badge credit"
                    } else if is_zero {
                        "pill-badge"
                    } else {
                        "pill-badge debt"
                    };
                    rsx! {
                        div { class: "warm-card", style: "padding: 14px 16px; margin-bottom: 0; display: flex; justify-content: space-between; align-items: center;",
                            div {
                                h4 { style: "font-size: 15px; font-weight: 700;", "{uid}" }
                                p { style: "font-size: 12px; color: var(--text-muted);", "Paid {mb.total_contributed} • Share {mb.total_share}" }
                            }
                            div {
                                class: "{badge_class}",
                                if is_pos {
                                    span { "+{mb.net_balance}" }
                                } else if is_zero {
                                    span { "Settled ✓" }
                                } else {
                                    span { "{mb.net_balance}" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn SmartSettleTab(
    mut state: Signal<AppState>,
    grp_id: String,
    balances: HashMap<String, papper_cutter_domain::MemberBalance>,
) -> Element {
    let s = state.read();
    let net_map: HashMap<_, _> = balances.iter().map(|(k, v)| (k.clone(), v.net_balance)).collect();

    let mut upi_map = HashMap::new();
    for u in &s.users {
        if let Some(ref pa) = u.upi_id {
            upi_map.insert(u.id.clone(), pa.clone());
        }
    }

    let plan = generate_settlement_plan(&grp_id, &net_map, &upi_map);

    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 12px; margin-top: 4px;",
            if plan.transactions.is_empty() {
                div { class: "warm-card", style: "text-align: center; padding: 32px 20px; background: linear-gradient(135deg, #FAF7F2 0%, #E8F8F0 100%); border: 1px solid var(--credit-border);",
                    div { style: "font-size: 36px; margin-bottom: 8px;", "🎉" }
                    h4 { style: "font-size: 16px; font-weight: 800; color: var(--credit-text); margin-bottom: 4px;", "All Settled Up!" }
                    p { style: "font-size: 13px; color: var(--text-muted);", "Everyone in this group is completely even. No pending dues." }
                }
            } else {
                div { style: "display: flex; flex-direction: column; gap: 12px;",
                    // Debt Simplification Highlight Card
                    div { class: "warm-card", style: "background: linear-gradient(135deg, #FAF7F2 0%, #E8F8F0 100%); border: 1px solid var(--credit-border);",
                        div { style: "display: flex; align-items: center; gap: 10px;",
                            span { style: "font-size: 24px;", "✨" }
                            div {
                                h4 { style: "font-size: 15px; font-weight: 800; color: var(--credit-text);",
                                    "Reduced to {plan.optimized_transactions_count} Payments"
                                }
                                p { style: "font-size: 12px; color: var(--text-muted);",
                                    "Optimized down from {plan.initial_transactions_count} circular transfers"
                                }
                            }
                        }
                    }

                    // Settlement Cards
                    for tx in &plan.transactions {
                        div { class: "warm-card", style: "padding: 16px; margin-bottom: 0;",
                            div { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;",
                                div {
                                    span { style: "font-size: 15px; font-weight: 800;", "{tx.from_user}" }
                                    span { style: "color: var(--text-muted); margin: 0 6px;", "owes" }
                                    span { style: "font-size: 15px; font-weight: 800; color: var(--primary);", "{tx.to_user}" }
                                }
                                span { style: "font-size: 18px; font-weight: 800;", "{tx.amount}" }
                            }

                            // UPI Deep-Link Action Button & Mark Paid
                            div { style: "display: flex; gap: 8px; align-items: center;",
                                if let Some(ref uri) = tx.upi_uri {
                                    a {
                                        href: "{uri}",
                                        class: "btn-primary",
                                        style: "text-decoration: none; padding: 10px 14px; font-size: 12px; flex: 2;",
                                        span { "📲 Pay via UPI" }
                                    }
                                }
                                button {
                                    class: "btn-secondary",
                                    style: "padding: 10px 14px; font-size: 12px; flex: 1; justify-content: center;",
                                    onclick: {
                                        let mut tx_clone = tx.clone();
                                        tx_clone.status = SettlementStatus::MarkedPaid;
                                        move |_| {
                                            state.write().settlements.push(tx_clone.clone());
                                        }
                                    },
                                    span { "Mark Paid ✓" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn GroupAnalyticsTab(expenses: Vec<papper_cutter_domain::Expense>) -> Element {
    let total: i64 = expenses.iter().map(|e| e.amount.paise()).sum();

    // Category breakdown
    let mut cat_map = HashMap::new();
    for e in &expenses {
        *cat_map.entry(e.category).or_insert(0i64) += e.amount.paise();
    }

    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 12px; margin-top: 4px;",
            div { class: "warm-card",
                h4 { style: "font-size: 15px; font-weight: 800; margin-bottom: 14px;", "Spending by Category" }
                for (cat, amount) in cat_map {
                    {
                        let pct = if total > 0 { (amount * 100) / total } else { 0 };
                        rsx! {
                            div { style: "margin-bottom: 12px;",
                                div { style: "display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;",
                                    span { "{cat.emoji()} {cat.display_name()}" }
                                    span { "{pct}% ({Money(amount)})" }
                                }
                                div { style: "height: 8px; width: 100%; background: var(--surface-high); border-radius: 9999px; overflow: hidden;",
                                    div { style: "height: 100%; width: {pct}%; background: var(--primary); border-radius: 9999px;" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

fn try_parse_ai_prompt(prompt: &str) -> Option<(f64, String, Category)> {
    let lower = prompt.to_lowercase();
    let mut amount = None;
    for token in lower.split_whitespace() {
        let clean: String = token.chars().filter(|c| c.is_numeric() || *c == '.').collect();
        if let Ok(val) = clean.parse::<f64>() {
            if val > 0.0 {
                amount = Some(val);
                break;
            }
        }
    }
    let cat = if lower.contains("dinner") || lower.contains("food") || lower.contains("lunch") || lower.contains("cafe") || lower.contains("pizza") {
        Category::Food
    } else if lower.contains("cab") || lower.contains("taxi") || lower.contains("uber") || lower.contains("travel") {
        Category::Travel
    } else if lower.contains("hotel") || lower.contains("stay") || lower.contains("resort") {
        Category::Stay
    } else if lower.contains("ticket") || lower.contains("ski") || lower.contains("pass") {
        Category::Tickets
    } else if lower.contains("grocery") || lower.contains("mart") {
        Category::Groceries
    } else {
        Category::Food
    };
    let desc = if lower.contains("dinner") { "Riverside Dinner" }
        else if lower.contains("cab") { "Valley Cab" }
        else if lower.contains("hotel") || lower.contains("resort") { "Resort Stay" }
        else if lower.contains("ticket") { "Activity Tickets" }
        else { "Group Expense" };
    amount.map(|amt| (amt, desc.to_string(), cat))
}

#[component]
fn AddExpenseSheet(mut state: Signal<AppState>) -> Element {
    let mut amount_str = use_signal(|| "".to_string());
    let mut desc_str = use_signal(|| "".to_string());
    let mut ai_prompt = use_signal(|| "".to_string());
    let mut category = use_signal(|| Category::Food);
    let mut payer = use_signal(|| state.read().current_user_id.clone());
    let mut error_msg = use_signal(|| None::<String>);

    rsx! {
        div { class: "bottom-sheet-backdrop",
            onclick: move |_| state.write().is_add_expense_open = false,
            div {
                class: "bottom-sheet",
                onclick: move |e| e.stop_propagation(),
                div { class: "sheet-handle" }

                div { style: "display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;",
                    h3 { style: "font-size: 18px; font-weight: 800;", "Add Expense" }
                    button {
                        style: "background: none; border: none; font-size: 20px; cursor: pointer;",
                        onclick: move |_| state.write().is_add_expense_open = false,
                        "✕"
                    }
                }

                // AI Natural Language Input Box
                div { style: "background: var(--surface-low); border-radius: 18px; padding: 12px; margin-bottom: 16px; border: 1px dashed var(--primary);",
                    div { style: "display: flex; gap: 6px; align-items: center; margin-bottom: 6px;",
                        span { "✨" }
                        span { style: "font-size: 12px; font-weight: 700; color: var(--primary-dark);", "AI Smart Entry" }
                    }
                    input {
                        style: "width: 100%; background: white; border: 1px solid var(--surface-border); border-radius: 12px; padding: 8px 12px; font-size: 13px;",
                        placeholder: "e.g. Rahul paid 1800 for dinner for all of us",
                        value: "{ai_prompt}",
                        oninput: move |e| {
                            let val = e.value();
                            ai_prompt.set(val.clone());
                            if let Some((amt, desc, cat)) = try_parse_ai_prompt(&val) {
                                amount_str.set(format!("{:.0}", amt));
                                desc_str.set(desc);
                                category.set(cat);
                            }
                        },
                    }
                    // Quick chips
                    div { style: "display: flex; gap: 6px; margin-top: 8px; overflow-x: auto;",
                        button {
                            style: "background: white; border: 1px solid var(--surface-border); border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;",
                            onclick: move |_| {
                                ai_prompt.set("Pizza Dinner 1800".to_string());
                                amount_str.set("1800".to_string());
                                desc_str.set("Riverside Dinner".to_string());
                                category.set(Category::Food);
                            },
                            "🍕 Dinner ₹1,800"
                        }
                        button {
                            style: "background: white; border: 1px solid var(--surface-border); border-radius: 9999px; padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;",
                            onclick: move |_| {
                                ai_prompt.set("Cab to Solang 1200".to_string());
                                amount_str.set("1200".to_string());
                                desc_str.set("Valley Cab".to_string());
                                category.set(Category::Travel);
                            },
                            "🚕 Solang Cab ₹1,200"
                        }
                    }
                }

                // Error message if any
                if let Some(err) = error_msg.read().as_ref() {
                    div { style: "background: var(--debt-bg); border: 1px solid var(--debt-border); color: var(--debt-text); padding: 8px 12px; border-radius: 12px; font-size: 12px; margin-bottom: 12px; font-weight: 600;",
                        "{err}"
                    }
                }

                // Amount Focus
                div { style: "text-align: center; margin: 14px 0;",
                    p { style: "font-size: 12px; color: var(--text-muted); font-weight: 600;", "ENTER AMOUNT (₹)" }
                    input {
                        style: "font-size: 36px; font-weight: 800; border: none; background: transparent; text-align: center; width: 100%; outline: none; color: var(--text-main);",
                        placeholder: "0.00",
                        value: "{amount_str}",
                        oninput: move |e| amount_str.set(e.value()),
                    }
                }

                // Description
                div { style: "margin-bottom: 14px;",
                    label { style: "font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 6px;", "DESCRIPTION" }
                    input {
                        style: "width: 100%; background: white; border: 1.5px solid var(--surface-border); border-radius: 14px; padding: 10px 14px; font-size: 14px;",
                        placeholder: "What was this for? (e.g. Dinner)",
                        value: "{desc_str}",
                        oninput: move |e| desc_str.set(e.value()),
                    }
                }

                // Payer Selector
                div { style: "margin-bottom: 14px;",
                    label { style: "font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 6px;", "PAID BY" }
                    div { style: "display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;",
                        for user in &state.read().users {
                            {
                                let uid = user.id.clone();
                                let is_sel = *payer.read() == uid;
                                rsx! {
                                    button {
                                        style: if is_sel {
                                            "padding: 6px 12px; border-radius: 9999px; border: 1.5px solid var(--primary); background: var(--primary-light); font-size: 12px; font-weight: 700; color: var(--primary-dark);"
                                        } else {
                                            "padding: 6px 12px; border-radius: 9999px; border: 1px solid var(--surface-border); background: white; font-size: 12px; font-weight: 600; color: var(--text-muted);"
                                        },
                                        onclick: move |_| payer.set(uid.clone()),
                                        "{user.name}"
                                    }
                                }
                            }
                        }
                    }
                }

                // Category Selector
                div { style: "margin-bottom: 20px;",
                    label { style: "font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px;", "CATEGORY" }
                    div { style: "display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;",
                        for (cat, label) in [
                            (Category::Food, "Food 🍕"),
                            (Category::Travel, "Travel 🚕"),
                            (Category::Stay, "Stay 🏨"),
                            (Category::Tickets, "Tickets 🎟️"),
                            (Category::Groceries, "Groceries 🛒"),
                        ] {
                            button {
                                style: if *category.read() == cat {
                                    "padding: 8px 14px; border-radius: 9999px; border: 1.5px solid var(--primary); background: var(--primary-light); font-size: 12px; font-weight: 700; color: var(--primary-dark);"
                                } else {
                                    "padding: 8px 14px; border-radius: 9999px; border: 1px solid var(--surface-border); background: white; font-size: 12px; font-weight: 600; color: var(--text-muted);"
                                },
                                onclick: move |_| category.set(cat),
                                "{label}"
                            }
                        }
                    }
                }

                // Submit Button
                button {
                    class: "btn-primary",
                    onclick: move |_| {
                        let raw_amt: f64 = amount_str.read().trim().parse().unwrap_or(0.0);
                        if raw_amt <= 0.0 {
                            error_msg.set(Some("Please enter a valid amount".to_string()));
                            return;
                        }
                        let desc = if desc_str.read().trim().is_empty() {
                            "Shared Expense".to_string()
                        } else {
                            desc_str.read().trim().to_string()
                        };
                        let cat = *category.read();
                        let amount = Money::from_paise((raw_amt * 100.0).round() as i64);
                        let (selected_group_id, participants) = {
                            let s = state.read();
                            let grp = s.groups.iter().find(|g| g.id == s.selected_group_id).cloned();
                            let participants = grp.map(|g| g.members).unwrap_or_else(|| vec![s.current_user_id.clone()]);
                            (s.selected_group_id.clone(), participants)
                        };
                        let payer_id = payer.read().clone();

                        match calculate_equal_split(amount, &payer_id, &participants) {
                            Ok(split_shares) => {
                                let new_exp = Expense {
                                    id: format!("exp-{}", &uuid::Uuid::new_v4().to_string()[..8]),
                                    group_id: selected_group_id,
                                    description: desc,
                                    category: cat,
                                    amount,
                                    paid_by: payer_id,
                                    participants,
                                    split_type: SplitType::Equal,
                                    split_shares,
                                    date: "Today".to_string(),
                                    notes: None,
                                };
                                state.write().expenses.insert(0, new_exp);
                                state.write().is_add_expense_open = false;
                            }
                            Err(e) => {
                                error_msg.set(Some(format!("Split calculation error: {}", e)));
                            }
                        }
                    },
                    span { "Save Expense" }
                }
            }
        }
    }
}

#[component]
fn AllExpensesView(mut state: Signal<AppState>) -> Element {
    let s = state.read();
    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 12px;",
            h2 { style: "font-size: 20px; font-weight: 800; margin-bottom: 4px;", "All Group Expenses" }
            for exp in &s.expenses {
                div { class: "warm-card", style: "margin-bottom: 0;",
                    div { style: "display: flex; justify-content: space-between; align-items: center;",
                        div { style: "display: flex; align-items: center; gap: 12px;",
                            span { style: "font-size: 24px;", "{exp.category.emoji()}" }
                            div {
                                h4 { style: "font-size: 14px; font-weight: 700;", "{exp.description}" }
                                p { style: "font-size: 12px; color: var(--text-muted);", "{exp.paid_by} paid • {exp.date}" }
                            }
                        }
                        span { style: "font-size: 16px; font-weight: 800;", "{exp.amount}" }
                    }
                }
            }
        }
    }
}

#[component]
fn ProfileView(state: Signal<AppState>) -> Element {
    let s = state.read();
    let current_user = s.users.iter().find(|u| u.id == s.current_user_id);
    let name = current_user.map(|u| u.name.as_str()).unwrap_or("Harsh Sharma");
    let email = current_user.map(|u| u.email.as_str()).unwrap_or("harsh@pappercutter.app");
    let upi = current_user.and_then(|u| u.upi_id.as_deref()).unwrap_or("harsh@okaxis");

    rsx! {
        div { style: "display: flex; flex-direction: column; gap: 16px; align-items: center; padding-top: 20px;",
            div { style: "width: 72px; height: 72px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: var(--primary);",
                "HS"
            }
            div { style: "text-align: center;",
                h3 { style: "font-size: 20px; font-weight: 800;", "{name}" }
                p { style: "font-size: 13px; color: var(--text-muted);", "{email}" }
                p { style: "font-size: 13px; color: var(--primary); font-weight: 600; margin-top: 4px;", "UPI ID: {upi}" }
            }

            div { class: "warm-card", style: "width: 100%; margin-top: 10px;",
                h4 { style: "font-size: 14px; font-weight: 700; margin-bottom: 8px;", "App Information" }
                p { style: "font-size: 13px; color: var(--text-muted);", "Papper Cutter v0.1.0" }
                p { style: "font-size: 13px; color: var(--text-muted);", "Warm Pastel Harmony Edition" }
            }
        }
    }
}
