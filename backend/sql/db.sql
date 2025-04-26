CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role VARCHAR(50) DEFAULT 'waiter'
);


CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price NUMERIC(10, 2) NOT NULL,
  available BOOLEAN DEFAULT true
);

CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  table_number INT UNIQUE NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(20) DEFAULT 'available'
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  table_id INT REFERENCES tables(id),
  user_id INT REFERENCES users(id), -- waiter
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  item_id INT REFERENCES menu_items(id),
  quantity INT NOT NULL
);

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  order_id INT UNIQUE REFERENCES orders(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
