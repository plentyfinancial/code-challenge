/*
    Given 3/4 loan input values, calculates the missing value and returns all.
    See `Loan` type for input value details.

    NOTE: interestRate should be specified as an annual rate, and is applied 
    per-month by this calculation. See Example for implementation details.

    Example:

    For a $175k 30-year mortgage with 4.25% annual interest rate, 
    the input would be:

    {
        amount: 17500000,
        numMonths: 360,
        interestRate: 4.25,
    }
    
    and output would be:
    
    {
        amount: 17500000,
        numMonths: 360,
        interestRate: 4.25,
        payment: 8481400,
    }

    Math source: https://www.calculatorsoup.com/calculators/financial/loan-calculator.php
*/

export type Loan = {
    amount: number; // Total loan amount in cents, ex: 17500000
    payment: number; // Payment per month in cents, ex: 84814
    numMonths: number; // Number of months, ex: 360
    interestRate: number; // Annual interest rate as a percent, ex: 4.25
};

export type LoanInput = Partial<Loan> & Pick<Loan, 'interestRate'>;

export function calculateLoan(input: LoanInput): Loan {
    const { amount, payment, numMonths, interestRate } = input;
    let pv = amount;
    let pmt = payment;
    let n = numMonths;

    // Convert interest rate to monthly decimal for calculations.
    const ir = interestRate / 100 / 12;

    if (!pv && !!pmt && !!n) {
        pv = Math.round((pmt / ir) * (1 - 1 / Math.pow(1 + ir, n)));
    } else if (!pmt && !!pv && !!n) {
        pmt = Math.round(
            (pv * ir * Math.pow(1 + ir, n)) / (Math.pow(1 + ir, n) - 1)
        );
    } else if (!n && !!pv && !!pmt) {
        n = Math.ceil(Math.log(pmt / ir / (pmt / ir - pv)) / Math.log(1 + ir));
    } else {
        throw new Error('Invalid params passed to calculateLoan');
    }

    return { amount: pv, payment: pmt, numMonths: n, interestRate };
}
