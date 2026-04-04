# UI Wireframes

All wireframes are mobile-first.

## 1. Login

```text
+----------------------------------+
| Hotel Guardian Cloud             |
| Safe hotel operations, daily     |
|                                  |
| [ Email / Phone ]                |
| [ Password      ]                |
|                                  |
| [ Sign In ]                      |
|                                  |
| Need help? Contact admin         |
+----------------------------------+
```

## 2. Home Dashboard

```text
+----------------------------------+
| Hello, Praveen                   |
| Hotel: Lucent                    |
| Today: Sat, 04 Apr               |
|                                  |
| [ Due Now: 3 ] [ Missed: 1 ]     |
|                                  |
| [ Worker Report ]                |
| [ Room Audit ]                   |
| [ Work Holds ]                   |
| [ Issues / Inventory ]           |
| [ Water Meter ]                  |
|                                  |
| Today's Timeline                 |
| 08:30 Worker log - Due           |
| 09:30 Dining cleaning - Pending  |
| 10:00 Pool photos - Pending      |
|                                  |
| Bottom Nav: Home | Alerts | Me   |
+----------------------------------+
```

## 3. Worker Report List

```text
+----------------------------------+
| Worker Report                    |
| [Today] [Missed] [Completed]     |
|                                  |
| 08:30 Rangana - Enter  [Due]     |
| 08:30 Praveen - Enter  [Done]    |
| 08:30 Preetham - Exit [Missed]   |
| 09:00 Yashoda - Enter  [Pending] |
|                                  |
| Tap item to submit proof         |
+----------------------------------+
```

## 4. Worker Report Capture

```text
+----------------------------------+
| Rangana - Enter                  |
| Scheduled: 08:30 AM              |
| Auto time: 08:31 AM              |
|                                  |
| [ Open Camera ]                  |
| Camera proof required            |
|                                  |
| Photo captured: 1/1              |
| [ Retake ]                       |
|                                  |
| Optional note                    |
| [____________________]           |
|                                  |
| [ Submit Entry ]                 |
+----------------------------------+
```

## 5. Room Audit Mode Select

```text
+----------------------------------+
| Room Audit                       |
|                                  |
| [ Before Check-In ]              |
| [ After Check-Out ]              |
|                                  |
| Recent Audits                    |
| Room 102 - Submitted             |
| Room 205 - Flagged               |
+----------------------------------+
```

## 6. Before Check-In Audit Form

```text
+----------------------------------+
| Before Check-In                  |
| Guest Name [____________]        |
| Check-in   [ dd/mm/yyyy ]        |
| Check-out  [ dd/mm/yyyy ]        |
| Room No.   [____]                |
|                                  |
| AC Remote         [Capture]      |
| TV Remote         [Capture]      |
| Set-top Box       [Capture]      |
| Bed Condition     [Select v]     |
| Towel Count       [  2 ]         |
| Towel Photo       [Capture]      |
| Bathroom Photos   [2/2 done]     |
| Kettle & Tray     [Capture]      |
| Menu Cards        [Capture]      |
|                                  |
| Missing: 3 required items        |
| [ Submit Audit ] disabled        |
+----------------------------------+
```

## 7. After Check-Out Comparison Form

```text
+----------------------------------+
| After Check-Out                  |
| Guest Name [ Search________ ]    |
| Room 102                         |
| Previous towel count: 2          |
|                                  |
| Current towel count [ 1 ]        |
| Mismatch detected                |
| [ Create linked issue ] checked  |
|                                  |
| Bed Condition     [Select v]     |
| Bathroom Photos   [Capture]      |
| AC Remote         [Capture]      |
| TV Remote         [Capture]      |
| Set-top Box       [Capture]      |
| Kettle & Tray     [Capture]      |
| Menu Cards        [Capture]      |
|                                  |
| [ Submit Audit ]                 |
+----------------------------------+
```

## 8. Work Holds List

```text
+----------------------------------+
| Work Holds                       |
| [Due Now] [Today] [Templates]    |
|                                  |
| Dining Cleaning      09:30       |
| Pool Photos          10:00       |
| Backwash             Thu 10:30   |
| Lift Wiping          Wed 15:00   |
|                                  |
| [+ Add Task] admin only          |
+----------------------------------+
```

## 9. Multi-Step Task Detail

```text
+----------------------------------+
| Pool Cleaning                    |
| Tue 10:00 - 11:00                |
| Status: In Progress              |
|                                  |
| Step 1 Pre-clean photo [Done]    |
| Step 2 Filter photo    [Open]    |
| Step 3 Chemical check  [Open]    |
| Step 4 Final clean shot [Open]   |
|                                  |
| [ Complete Task ] disabled       |
| Complete all steps with photos   |
+----------------------------------+
```

## 10. Issue Create

```text
+----------------------------------+
| Report Issue                     |
| Title        [____________]      |
| Description  [____________]      |
| Location     [____________]      |
| Priority     [ Medium      v ]   |
| Category     [ Damage      v ]   |
|                                  |
| Photo proof  [ Open Camera ]     |
|                                  |
| [ Submit Issue ]                 |
+----------------------------------+
```

## 11. Water Meter Capture

```text
+----------------------------------+
| Water Meter                      |
| Due every 2 hours                |
| Next due: 12:00 PM               |
|                                  |
| Meter Reading [__________]       |
| Meter Photo   [ Open Camera ]    |
| Auto time: 10:01 AM              |
|                                  |
| [ Submit Reading ]               |
+----------------------------------+
```

## 12. Admin Console

```text
+----------------------------------+
| Admin Console                    |
| [Users] [Schedules] [Tasks]      |
| [Templates] [Reports] [Analytics]|
|                                  |
| Tasks                            |
| Pool Cleaning        [Edit]      |
| Backwash             [Edit]      |
| Dining Cleaning      [Edit]      |
|                                  |
| [ Add New Task ]                 |
+----------------------------------+
```

## 13. Analytics Dashboard

```text
+----------------------------------+
| Analytics                        |
| Completion Rate: 92%             |
| Worker Compliance: 88%           |
| Water Logs: 95%                  |
| Open Issues: 14                  |
|                                  |
| [Date Filter] [Hotel Filter]     |
|                                  |
| Chart: tasks completed by day    |
| Chart: missed events by staff    |
| Chart: issue aging               |
+----------------------------------+
```

## UX notes

- Use bottom sheets for quick actions on mobile
- Use sticky submit bars for long forms
- Use photo counters next to every required evidence field
- Use warning banners for missed or flagged items
- Keep admin screens mobile-usable, but allow tablet/desktop enhancement
