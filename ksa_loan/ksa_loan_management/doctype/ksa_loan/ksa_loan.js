// Copyright (c) 2024, Nasiruddin Ansari and contributors
// For license information, please see license.txt

frappe.ui.form.on('KSA Loan', {
    before_save: function(frm) {
        if (frm.doc.full_loan_amount && frm.doc.repayment_periods && frm.doc.repayment_start_date) {
            let total_amount = frm.doc.full_loan_amount;
            let num_of_installments = frm.doc.repayment_periods;
            let installment_amount = total_amount / num_of_installments;
            let start_date = frm.doc.repayment_start_date;
            let remaining_balance = total_amount;
            frm.clear_table('repayment_details');
            for (let i = 0; i < num_of_installments; i++) {
                let due_date = frappe.datetime.add_months(start_date, i);
                let payment_amount = Math.min(installment_amount, remaining_balance);
                let row = frm.add_child('repayment_details', {
                    'payment_date': due_date,
                    'principal_amount': payment_amount,
                    'balance_loan_amount': remaining_balance - payment_amount
                });
                remaining_balance -= payment_amount;
            }
            frm.refresh_field('repayment_details');
        }
    }
});
frappe.ui.form.on("KSA Loan", "rate", function(frm, cdt, cdn){
          var d = locals[cdt][cdn];
          cur_frm.set_value("interest_amount", d.loan_amount*d.rate/100);
          });
          
frappe.ui.form.on("KSA Loan", "interest_amount", function(frm, cdt, cdn){
          var d = locals[cdt][cdn];
          cur_frm.set_value("full_loan_amount", d.interest_amount + d.loan_amount);
          });
          
frappe.ui.form.on("KSA Loan", "repayment_periods", function(frm, cdt, cdn){
          var d = locals[cdt][cdn];
          cur_frm.set_value("monthly_repayment_amount", d.full_loan_amount/ d.repayment_periods);
          });
