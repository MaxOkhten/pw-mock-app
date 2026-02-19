import { Page, expect } from "@playwright/test";

export class DatepickerPage {
    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectCommonDatepickerFromToday(daysFromToday: number) {

        const calendarLocator = this.page.getByPlaceholder('Form Picker')
        await calendarLocator.click()
  
        let date = new Date()
        date.setDate(date.getDate() + daysFromToday)
    
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
    
        await calendarLocator.click()
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
    
        await this.page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
        await expect(calendarLocator).toHaveValue(`${expectedMonthShort} ${expectedDate}, ${expectedYear}`)
    }
}