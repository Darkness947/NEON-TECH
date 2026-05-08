# NEON TECH – System Flow Diagram

```mermaid
flowchart TD
    Start(["User Visits Website"]) --> Home["Homepage - Product Grid"]

    Home --> Search["Search / Filter Category"]
    Search -.-> Home
    Home --> ToggleLang["Toggle Language EN/AR"]
    ToggleLang -.-> Home

    Home -->|"Click Product"| ProductDetail["Product Detail Page"]
    ProductDetail -.->|"View Related"| ProductDetail

    ProductDetail -->|"Explain with AI"| AIExplain["AI Product Explanation"]
    Home -->|"Select 2 Products"| AICompare["AI Product Comparison"]

    Home -->|"Login"| AuthLogin["Login Page"]
    Home -->|"Register"| AuthReg["Register Page"]
    ProductDetail -->|"Write Review"| AuthCheck1{"Is Logged In?"}
    AuthCheck1 -->|"No"| AuthLogin
    AuthCheck1 -->|"Yes"| SubmitReview["Submit Review"]

    ProductDetail -->|"Toggle Wishlist"| AuthCheckWish{"Is Logged In?"}
    AuthCheckWish -->|"No"| AuthLogin
    AuthCheckWish -->|"Yes"| WishlistAdd["Add/Remove Item"]
    WishlistAdd --> WishlistView["My Wishlist Page"]

    Home -->|"Add to Cart"| AuthCheckCart{"Is Logged In?"}
    ProductDetail -->|"Add to Cart"| AuthCheckCart
    AuthCheckCart -->|"No"| AuthLogin
    AuthCheckCart -->|"Yes"| CartAdd["Add to Session Cart"]

    CartAdd --> CartView["Shopping Cart Page"]
    CartView -->|"Update Qty / Remove"| CartView
    CartView -->|"Checkout"| Checkout["Checkout Page"]

    Checkout -->|"Pay via Stripe"| StripeExt(("Stripe Checkout"))

    StripeExt -->|"Success"| OrderCreate["Create Order, Clear Cart, Update Stock"]
    OrderCreate --> SendEmail["Send Receipt Email"]
    SendEmail --> SuccessPage["Order Success Page"]

    StripeExt -->|"Cancel/Fail"| Checkout

    SuccessPage --> ViewOrders["My Orders Page"]
    AuthLogin -->|"Success"| ViewOrders
    ViewOrders -->|"Click Order"| OrderDetail["Order Detail Page"]

    classDef page fill:#0d0d20,stroke:#bf00ff,color:#e8e8ff
    classDef check fill:#08080f,stroke:#ffae00,color:#e8e8ff
    classDef ext fill:#0a0015,stroke:#00f5ff,color:#e8e8ff
    classDef ai fill:#0d0d20,stroke:#00ff88,color:#00ff88

    class Home,ProductDetail,AuthLogin,AuthReg,CartView,Checkout,SuccessPage,ViewOrders,OrderDetail,WishlistView page
    class AuthCheck1,AuthCheckCart,AuthCheckWish check
    class StripeExt ext
    class AIExplain,AICompare ai
```
