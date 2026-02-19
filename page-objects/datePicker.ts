import { Page, expect } from "@playwright/test";

export class DatepickerPage {
    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectCommonDatepickerFromToday(daysFromToday: number) {
        const calendarLocator = this.page.getByPlaceholder('Form Picker')
        await calendarLocator.click()
        const dateToAssert = await this.selectDateInCalendar(daysFromToday)
  
        await expect(calendarLocator).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDaysFromToday: number, endDaysFromToday: number) {
        const calendarLocator = this.page.getByPlaceholder('Range Picker')
        await calendarLocator.click()

        const startDateToAssert = await this.selectDateInCalendar(startDaysFromToday)
        const endDateToAssert = await this.selectDateInCalendar(endDaysFromToday)

        const dateToAssert = `${startDateToAssert} - ${endDateToAssert}`
        await expect(calendarLocator).toHaveValue(dateToAssert)

    }

    //reusable date selector
    private async selectDateInCalendar(daysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + daysFromToday)
    
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
    
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()

        return `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    }
}