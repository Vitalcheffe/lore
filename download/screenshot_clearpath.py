#!/usr/bin/env python3
"""Take preview screenshots of the ClearPath AI showcase HTML."""

import asyncio
from playwright.async_api import async_playwright

HTML_PATH = "/home/z/my-project/download/clearpath_modern_rendered.html"
OUTPUT_DIR = "/home/z/my-project/download"

async def screenshot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 720, "height": 960})

        await page.goto(f"file://{HTML_PATH}", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Take a full-page screenshot
        await page.screenshot(
            path=f"{OUTPUT_DIR}/clearpath_preview.png",
            full_page=True,
        )

        # Also take just the first page (cover)
        await page.screenshot(
            path=f"{OUTPUT_DIR}/clearpath_cover_preview.png",
            clip={"x": 0, "y": 0, "width": 720, "height": 960},
        )

        await browser.close()
        print("Screenshots saved!")

if __name__ == "__main__":
    asyncio.run(screenshot())
