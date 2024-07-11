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

		BudgetLineItem getLineItem(int i) const { return lineItems[i]; }
		
		double getBudgetTotal() const {
			return std::accumulate(lineItems.begin(), lineItems.end(), 0.0, [](double sum, const BudgetLineItem& lineItem) { return sum+lineItem.budgetTotal; });
		}
};