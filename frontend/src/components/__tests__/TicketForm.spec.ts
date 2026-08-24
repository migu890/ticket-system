import {
  describe,
  expect,
  it,
  vi
} from 'vitest'

import {
  mount
} from '@vue/test-utils'

import TicketForm from '../TicketForm.vue'

vi.mock('../../api/ticketApi', () => ({
  createTicket: vi.fn(),
  updateTicket: vi.fn()
}))

describe('TicketForm', () => {
  it('zeigt im Create-Modus den Titel Ticket erstellen', () => {
    const wrapper = mount(TicketForm)

    expect(
      wrapper.text()
    ).toContain('Ticket erstellen')
  })

  it('zeigt die benötigten Formularfelder', () => {
    const wrapper = mount(TicketForm)

    expect(
      wrapper.find('#title').exists()
    ).toBe(true)

    expect(
      wrapper.find('#description').exists()
    ).toBe(true)

    expect(
      wrapper.find('#priority').exists()
    ).toBe(true)
  })
})