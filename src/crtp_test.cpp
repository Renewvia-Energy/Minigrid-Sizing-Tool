#include <memory>

template<typename Derived>
struct Clonable
{
    virtual ~Clonable() = default;

    std::unique_ptr<Derived> clone() const
    {
        return std::unique_ptr<Derived>(cloneImpl());
    }
    
protected:
    virtual Derived* cloneImpl() const = 0;
};

struct Interface : Clonable<Interface>
{
    // Other interface methods...
};

class Implementation : public Interface
{
public:
    // Other implementation methods...

protected:
    virtual Implementation* cloneImpl() const override
    {
        return new Implementation(*this);
    }
};

int main()
{
    Implementation impl;

    // Cloning through Interface (this works)
    std::unique_ptr<Interface> interfaceClone = impl.clone();

    // If you need an Implementation pointer, you'll need to use dynamic_cast
    std::unique_ptr<Implementation> implClone(
        dynamic_cast<Implementation*>(impl.clone().release())
    );

    // Alternatively, you could add a clone method to Implementation
    // that returns an Implementation pointer
    // std::unique_ptr<Implementation> implClone = impl.cloneAsImplementation();

    return 0;
}