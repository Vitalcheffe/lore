#!/usr/bin/env python3
import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    
    errors = []
    page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
    page.on("pageerror", lambda err: errors.append(f"[PAGE_ERROR] {err}"))
    
    page.goto("http://localhost:3000/", wait_until="networkidle", timeout=30000)
    time.sleep(3)
    page.screenshot(path="/home/z/my-project/download/impact-hero-final.png")
    
    # Scroll through page
    for y in [500, 1000, 1500, 2000, 2500, 3000, 0]:
        page.evaluate(f"window.scrollTo(0, {y})")
        time.sleep(0.5)
    
    # Click a card
    cards = page.query_selector_all(".cursor-pointer.group")
    if len(cards) >= 3:
        cards[2].click()
        time.sleep(0.5)
    
    page.screenshot(path="/home/z/my-project/download/impact-full-final.png", full_page=True)
    
    if errors:
        print(f"ERRORS ({len(errors)}):")
        for e in errors[:5]:
            print(f"  {e}")
    else:
        print("OK - No errors, page renders correctly")
    
    browser.close()
