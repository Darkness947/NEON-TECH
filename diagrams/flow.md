# NEON TECH – System Flow Diagram

```mermaid
flowchart TD
    %% User Entry
    Start([User Visits Website]) --> Home[Homepage (/)<br/>Product Grid]

    %% Navigation & Search
    Home --> Search[Search / Filter Category]
    Search -.-> Home
    Home --> ToggleLang[Toggle Language (EN/AR)]
    ToggleLang -.-> Home

    %% Product Discovery
    Home -->|Click Product| ProductDetail[Product Detail Page<br/>(/products/:id)]
    ProductDetail -.-> |View Related| ProductDetail

    %% Authentication
    Home -->|Login| AuthLogin[Login Page]
    Home -->|Register| AuthReg[Register Page]
    ProductDetail -->|Write Review (requires auth)| AuthCheck1{Is Logged In?}
    AuthCheck1 -->|No| AuthLogin
    AuthCheck1 -->|Yes| SubmitReview[Submit Review]
    
    %% Wishlist
    ProductDetail -->|Toggle Wishlist| AuthCheckWish{Is Logged In?}
    AuthCheckWish -->|No| AuthLogin
    AuthCheckWish -->|Yes| WishlistAdd[Add/Remove Item]
    WishlistAdd --> WishlistView[My Wishlist Page]

    %% Cart & Checkout Flow
    Home -->|Add to Cart| AuthCheckCart{Is Logged In?}
    ProductDetail -->|Add to Cart| AuthCheckCart
    AuthCheckCart -->|No| AuthLogin
    AuthCheckCart -->|Yes| CartAdd[Add to Session Cart]
    
    CartAdd --> CartView[Shopping Cart Page]
    CartView -->|Update Qty / Remove| CartView
    CartView -->|Checkout| Checkout[Checkout Page]
    
    Checkout -->|Pay via Stripe| StripeExt((Stripe Checkout Gateway))
    
    StripeExt -->|Success| OrderCreate[Create Order in DB<br/>Clear Cart<br/>Update Stock]
    OrderCreate --> SendEmail[Nodemailer: Send Receipt Email]
    SendEmail --> SuccessPage[Order Success Page]
    
    StripeExt -->|Cancel/Fail| Checkout
    
    %% User Dashboard Flow
    SuccessPage --> ViewOrders[My Orders Page]
    AuthLogin -->|Success| ViewOrders
    ViewOrders -->|Click Order| OrderDetail[Order Detail Page]
    
    %% CSS Styling
    classDef page fill:#0d0d20,stroke:#bf00ff,color:#e8e8ff;
    classDef check fill:#08080f,stroke:#ffae00,color:#e8e8ff,shape:diamond;
    classDef ext fill:#0a0015,stroke:#00f5ff,color:#e8e8ff;
    
    class Home,ProductDetail,AuthLogin,AuthReg,CartView,Checkout,SuccessPage,ViewOrders,OrderDetail,WishlistView page;
    class AuthCheck1,AuthCheckCart,AuthCheckWish check;
    class StripeExt ext;
```
