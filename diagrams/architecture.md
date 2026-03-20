# NEON TECH – System Architecture Diagram

```mermaid
graph TB
    subgraph Client["🌐 Client Browser"]
        B[Browser / Bootstrap 5]
        CSS[neon.css]
        JS[main.js]
    end

    subgraph Server["⚙️ Node.js + Express Server"]
        direction TB
        APP[app.js<br/>helmet · session · flash · method-override]
        
        subgraph Routes["📦 Routes"]
            R1[/ index.js<br/>Home · Search · Category · Lang]
            R2[/auth auth.js<br/>Register · Login · Logout]
            R3[/products products.js<br/>Detail · Reviews]
            R4[/cart cart.js<br/>Add · Update · Remove · Clear]
            R5[/checkout checkout.js<br/>Stripe Session · Success · Cancel]
            R6[/orders orders.js<br/>History · Detail]
            R7[/wishlist wishlist.js<br/>Toggle · View]
            R8[/reviews reviews.js<br/>Submit · Delete]
        end

        subgraph Config["🔧 Config"]
            DB[config/db.js<br/>MySQL2 Pool]
            ML[config/mailer.js<br/>Nodemailer · Gmail]
        end

        subgraph Views["🎨 Views (EJS)"]
            V1[layouts/main.ejs]
            V2[partials/navbar · footer]
            V3[index · product · cart<br/>checkout · error]
            V4[auth/login · register]
            V5[orders/history · detail]
            V6[wishlist · checkout_success]
        end
    end

    subgraph External["☁️ External Services"]
        STRIPE["💳 Stripe\n(Test Payments)"]
        GMAIL["📧 Gmail / Nodemailer\n(Order Confirmation)"]
    end

    subgraph Database["🗄️ MySQL Database"]
        direction LR
        T1[(Users)]
        T2[(Products)]
        T3[(ShopCart)]
        T4[(Orders)]
        T5[(OrderItems)]
        T6[(Wishlist)]
        T7[(Reviews)]
    end

    B -->|HTTP Requests| APP
    APP --> Routes
    Routes --> DB
    Routes --> ML
    DB -->|Parameterized SQL| Database
    ML -->|SMTP| GMAIL
    R5 -->|Stripe API| STRIPE
    STRIPE -->|Redirect| B
    APP --> Views
    Views -->|HTML + EJS| B

    style Client   fill:#08080f,stroke:#00f5ff,color:#e8e8ff
    style Server   fill:#0d0d20,stroke:#bf00ff,color:#e8e8ff
    style Database fill:#0a0015,stroke:#00f5ff,color:#e8e8ff
    style External fill:#0f0a00,stroke:#ffae00,color:#e8e8ff
```
