import type { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.logo}>G</div>

          <div>
            <h1>Granite</h1>
            <span>Marketplace</span>
          </div>
        </div>

        <div className={styles.hero}>
          <p className={styles.badge}>GRANITE MARKETPLACE</p>

          <h2>
            Trade smarter.
            <br />
            Build better.
          </h2>

          <p className={styles.description}>
            A secure marketplace built for modern businesses, sellers, and
            customers.
          </p>

          <div className={styles.features}>
            <div>
              <span>✓</span>
              Secure authentication
            </div>

            <div>
              <span>✓</span>
              Trusted marketplace
            </div>

            <div>
              <span>✓</span>
              Simple and secure trading
            </div>
          </div>
        </div>

        <p className={styles.copyright}>© 2026 Granite Marketplace</p>
      </section>

      <section className={styles.right}>
        <div className={styles.formContainer}>{children}</div>
      </section>
    </main>
  );
}
