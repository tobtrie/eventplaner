import { Event } from './event.dto';
import { v4 } from 'uuid';

export const exampleData: Event[] = [
  Event.create(
    v4(),
    'X-mas party',
    new Date('2023-12-22T20:00:00Z'),
    'Cologne',
  ),
  Event.create(v4(), 'Carnival', new Date('2023-02-12T20:00:00Z'), 'Cologne'),
  {
    id: v4(),
    title: "New Year's Eve",
    date: new Date('2023-12-31T22:00:00Z'),
    city: 'Aachen',
    tickets: [
      {
        firstName: 'Cassidy',
        lastName: 'Luna',
        barcode: 'cwv87cua',
      },
      {
        firstName: 'Benjamin',
        lastName: 'Compton',
        barcode: 'vwm18kjx',
      },
      {
        firstName: 'Nelle',
        lastName: 'Brown',
        barcode: 'ppw06tjd',
      },
      {
        firstName: 'Hyacinth',
        lastName: 'Duncan',
        barcode: 'tjb66sul',
      },
      {
        firstName: 'Latifah',
        lastName: 'Holmes',
        barcode: 'dep85kms',
      },
      {
        firstName: 'Leilani',
        lastName: 'Byers',
        barcode: 'ano80osw',
      },
      {
        firstName: 'Riley',
        lastName: 'Case',
        barcode: 'jht74mpm',
      },
      {
        firstName: 'Ahmed',
        lastName: 'Parker',
        barcode: 'ghq44iyf',
      },
      {
        firstName: 'Madison',
        lastName: 'Ware',
        barcode: 'djo33prp',
      },
      {
        firstName: 'Prescott',
        lastName: 'Cotton',
        barcode: 'hgf56qun',
      },
    ],
  },
];
