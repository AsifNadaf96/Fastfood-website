from flask import Flask, request, session, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'secret123'
CORS(app)

# Menu items
menu = [
    {'id': 1, 'name': 'Burger', 'price': 99},
    {'id': 2, 'name': 'Pizza', 'price': 199},
    {'id': 3, 'name': 'French Fries', 'price': 79},
    {'id': 4, 'name': 'Coke', 'price': 49}
]

# Store orders
orders = []

@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(menu)

@app.route('/api/cart', methods=['GET', 'POST', 'DELETE'])
def cart():
    if 'cart' not in session:
        session['cart'] = []

    if request.method == 'GET':
        return jsonify(session['cart'])

    elif request.method == 'POST':
        item_id = request.json.get('id')
        item = next((item for item in menu if item['id'] == item_id), None)
        if item:
            session['cart'].append(item)
            session.modified = True
            return jsonify({'message': 'Item added to cart'}), 200
        return jsonify({'error': 'Item not found'}), 404

    elif request.method == 'DELETE':
        session['cart'] = []
        return jsonify({'message': 'Cart cleared'}), 200

@app.route('/api/checkout', methods=['POST'])
def checkout():
    cart = session.get('cart', [])
    if cart:
        orders.append(cart.copy())
        session['cart'] = []
        return jsonify({'message': 'Order placed'}), 200
    return jsonify({'message': 'Cart is empty'}), 400

@app.route('/api/orders', methods=['GET'])
def get_orders():
    return jsonify(orders)

if __name__ == '__main__':
    app.run(debug=True)
