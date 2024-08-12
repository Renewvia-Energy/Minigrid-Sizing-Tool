#include <memory>
#include <iostream>

// Base class template using CRTP
template <typename Derived>
class Clonable {
public:
    virtual ~Clonable() = default;

    // The clone method returns a unique_ptr to the derived class
    std::unique_ptr<Derived> clone() const {
        return std::unique_ptr<Derived>(static_cast<Derived*>(this->clone_impl()));
    }

protected:
    // Protected virtual function for actual cloning
    virtual Clonable* clone_impl() const = 0;
};

// Example derived class
class MyClass : public Clonable<MyClass> {
public:
    MyClass(int value) : value_(value) {}

    int getValue() const { return value_; }

protected:
    // Implement the clone_impl method
    Clonable<MyClass>* clone_impl() const override {
        return new MyClass(*this);
    }

private:
    int value_;
};

int main() {
    auto original = std::make_unique<MyClass>(42);
    auto cloned = original->clone();

    std::cout << "Original value: " << original->getValue() << std::endl;
    std::cout << "Cloned value: " << cloned->getValue() << std::endl;

    return 0;
}