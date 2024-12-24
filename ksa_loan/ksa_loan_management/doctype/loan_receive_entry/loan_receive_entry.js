// Copyright (c) 2024, Nasiruddin Ansari and contributors
// For license information, please see license.txt

frappe.ui.form.on('Loan Receive Entry', {
    on_submit: function(frm) {
        const gl_entries = [
            {
                posting_date: frm.doc.date,               
                account: frm.doc.from_account,          
                credit: frm.doc.paid_amount,               
                credit_in_account_currency: frm.doc.paid_amount,
                party_type: 'Customer',
                party: frm.doc.customer,
                voucher_type: 'Loan Receive Entry',
                voucher_no: frm.doc.name,
                company: frm.doc.company,
                cost_center: frm.doc.cost_center    
            },
            {
                posting_date: frm.doc.date,
                account: frm.doc.to_account,           
                debit: frm.doc.paid_amount,                    
                debit_in_account_currency: frm.doc.paid_amount,
                company: frm.doc.company,
                party_type: 'Customer',
                party: frm.doc.customer,
                voucher_type: 'Loan Receive Entry',
                voucher_no: frm.doc.name,
                cost_center: frm.doc.cost_center    
            }
        ];

     
        gl_entries.forEach(gl_entry => {
            frappe.db.insert({
                doctype: 'GL Entry',
                ...gl_entry
            }).then((doc) => {
                frappe.msgprint(__('GL Entry created successfully for Account: {0}', [gl_entry.account]));
            });
        });
        
    }
});
frappe.ui.form.on('Loan Receive Entry', {
    refresh: function(frm) {
         if (frm.doc.docstatus === 1) {
        frm.add_custom_button(__('Accounting Ledger'), function() {
         
            frappe.set_route('query-report', 'General Ledger', {
                'voucher_no': frm.doc.name,
                'company': frm.doc.company
            });
        }, __('View'));
    }
    }
});
