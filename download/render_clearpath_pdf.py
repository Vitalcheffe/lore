#!/usr/bin/env python3
"""Render ClearPath AI showcase HTML to PDF using Playwright directly.
Handles continuous-canvas multi-page layout properly."""

import asyncio
from playwright.async_api import async_playwright
import os

HTML_PATH = "/home/z/my-project/download/clearpath_modern_rendered.html"
OUTPUT_PDF = "/home/z/my-project/download/ClearPath_AI_Modern_Showcase.pdf"
PAGE_WIDTH = 720
PAGE_HEIGHT = 960
TOTAL_PAGES = 8

async def render():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load the HTML file
        await page.goto(f"file://{HTML_PATH}", wait_until="networkidle")

        # Wait for fonts to load
        await page.wait_for_timeout(2000)

        # Render the entire document as a PDF with custom page size
        # The continuous canvas will paginate naturally
        await page.pdf(
            path=OUTPUT_PDF,
            width=f"{PAGE_WIDTH}px",
            height=f"{PAGE_HEIGHT}px",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )

        await browser.close()
        print(f"PDF generated: {OUTPUT_PDF}")
        print(f"Size: {os.path.getsize(OUTPUT_PDF) / 1024:.1f} KB")

if __name__ == "__main__":
    asyncio.run(render())
