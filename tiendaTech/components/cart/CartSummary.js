// components/cart/CartSummary.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';
import { colors } from '../../styles/colors';

const CartSummary = ({ total, itemCount, onCheckout }) => {
  // Validar valores
  const safeTotal = total || 0;
  const safeItemCount = itemCount || 0;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Resumen de Compra</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.label}>
          {safeItemCount} producto{safeItemCount !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.value}>${safeTotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.label}>Envío</Text>
        <Text style={styles.value}>Gratis</Text>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${safeTotal.toFixed(2)}</Text>
      </View>
      
      <Button
        title="Proceder al Checkout"
        onPress={onCheckout}
        fullWidth
        style={styles.checkoutButton}
        disabled={safeItemCount === 0}
      />
      
      <Text style={styles.disclaimer}>
        Esta es una simulación de checkout. No se procesarán pagos reales.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: 16,
    marginBottom: 12,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CartSummary;