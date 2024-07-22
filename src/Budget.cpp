#ifndef BUDGET_CPP
#define BUDGET_CPP

#include<string>
#include<vector>
#include<numeric>

struct BudgetLineItem {
	std::string category;
	std::string type;
	std::string item;
	std::string vendor;
	std::string notes;
	std::string currency;
	double qty;
	double price;
	bool budgetVAT;
	double budgetTotal;
};

class Budget {
	private:
		const double exchangeRateToUSD;
		const double vatRate;
		std::vector<BudgetLineItem> lineItems;

	public:
		Budget(double exchangeRateToUSD, double vatRate) : exchangeRateToUSD(exchangeRateToUSD), vatRate(vatRate), lineItems(std::vector<BudgetLineItem>()) {}

		/**
		 * Add a new line item to the budget.
		 *
		 * @param category The category of the line item.
		 * @param type The type of the line item.
		 * @param item The name of the item.
		 * @param vendor The vendor of the item.
		 * @param notes Any additional notes for the item.
		 * @param currency The currency of the item.
		 * @param qty The quantity of the item.
		 * @param price The price per unit of the item.
		 * @param budgetVAT True if VAT is included in the budget, false otherwise.
		 *
		 * @throws None
		 */
		void addLineItem(std::string category, std::string type, std::string item, std::string vendor, std::string notes, std::string currency, double qty, double price, bool budgetVAT) {
			lineItems.push_back({
				category: category,
				type: type,
				item: item,
				vendor: vendor,
				notes: notes,
				currency: currency,
				qty: qty,
				price: price,
				budgetVAT: budgetVAT,
				budgetTotal: (currency == "USD" ? 1 : exchangeRateToUSD)*(budgetVAT ? 1+vatRate : 0)*qty*price
			});
		}

		BudgetLineItem getLineItem(size_t i) const { return lineItems[i]; }
		
	/**
	 * Calculates the total budget by accumulating the budgetTotal of each BudgetLineItem in the lineItems vector.
	 *
	 * @return the total budget as a double
	 *
	 * @throws None
	 */
		double getBudgetTotal() const {
			return std::accumulate(lineItems.begin(), lineItems.end(), 0.0, [](double sum, const BudgetLineItem& lineItem) { return sum+lineItem.budgetTotal; });
		}
};

#endif // BUDGET_CPP