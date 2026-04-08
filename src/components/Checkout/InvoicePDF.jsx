import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#111827',
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    color: '#C6A969'
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
    marginBottom: 15,
  },
  headerCol: {
    flexDirection: 'column',
    width: '25%',
  },
  label: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 3,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#111827'
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#C6A969',
    padding: 8,
  },
  tableHeaderLeft: {
    flex: 1,
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableHeaderRight: {
    width: 60,
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8,
  },
  tableCellLeft: {
    flex: 1,
    fontSize: 10,
    color: '#6B7280',
  },
  tableCellRight: {
    width: 60,
    fontSize: 10,
    textAlign: 'right',
    color: '#111827',
  },
  tableFooter: {
    flexDirection: 'row',
    padding: 8,
  },
  tableFooterLeft: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  tableFooterRight: {
    width: 80,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#111827',
  },
  billingBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    color: '#6B7280',
    fontSize: 10,
    lineHeight: 1.5,
  },
  boldText: {
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
  }
});

const InvoicePDF = ({ orderReceived }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <Text style={styles.title}>Palm Mirage Hotel</Text>
      <Text style={styles.subtitle}>
        {orderReceived.documentTitle || 'Thank you. Your order has been received.'}
      </Text>

      <View style={styles.headerRow}>
        <View style={styles.headerCol}>
          <Text style={styles.label}>ORDER NUMBER:</Text>
          <Text style={styles.value}>{orderReceived.orderNumber}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text style={styles.label}>DATE:</Text>
          <Text style={styles.value}>{orderReceived.date}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text style={styles.label}>{(orderReceived.amountLabel || 'TOTAL').toUpperCase()}:</Text>
          <Text style={styles.value}>${orderReceived.total.toFixed(2)}</Text>
        </View>
        <View style={styles.headerCol}>
          <Text style={styles.label}>STATUS:</Text>
          <Text style={styles.value}>
            {orderReceived.paymentStatus || orderReceived.paymentCategory || orderReceived.paymentMethod}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Reservation Details</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderLeft}>PRODUCT</Text>
          <Text style={styles.tableHeaderRight}>TOTAL</Text>
        </View>
        
        {orderReceived.items?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>{item.name} x {item.quantity}</Text>
            <Text style={styles.tableCellRight}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        
        <View style={styles.tableRow}>
          <Text style={styles.tableFooterLeft}>Subtotal:</Text>
          <Text style={styles.tableFooterRight}>${orderReceived.total.toFixed(2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableFooterLeft}>Payment plan:</Text>
          <Text style={styles.tableFooterRight}>
            {(orderReceived.paymentCategory || 'Payment')} / {orderReceived.paymentMethod}
          </Text>
        </View>
        
        <View style={[styles.tableFooter, { backgroundColor: '#C6A969' }]}>
          <Text style={[styles.tableFooterLeft, { color: 'white', fontSize: 12 }]}>
            {orderReceived.amountLabel || 'Total'}:
          </Text>
          <Text style={[styles.tableFooterRight, { color: 'white', fontSize: 12 }]}>${orderReceived.total.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Billing Address</Text>
      <View style={styles.billingBox}>
        <Text style={styles.boldText}>{orderReceived.firstName} {orderReceived.lastName}</Text>
        {orderReceived.company && <Text>{orderReceived.company}</Text>}
        <Text>{orderReceived.address}</Text>
        {orderReceived.apartment && <Text>{orderReceived.apartment}</Text>}
        <Text>
          {orderReceived.city}{orderReceived.city?.toLowerCase() !== orderReceived.state?.toLowerCase() ? `, ${orderReceived.state}` : ''} {orderReceived.postcode}
        </Text>
        <Text>{orderReceived.country}</Text>
        <Text style={{ marginTop: 10 }}>Phone: {orderReceived.phone}</Text>
        <Text>Email: {orderReceived.email}</Text>
      </View>
      
    </Page>
  </Document>
);

export default InvoicePDF;
