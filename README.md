# IPGeolocation Inspector

> Inspect IP addresses directly inside Visual Studio Code using the ipgeolocation.io API

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/YOUR-PUBLISHER.ipgeolocation-inspector)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/YOUR-PUBLISHER.ipgeolocation-inspector)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Analyze IP addresses found in logs, configs, API responses, or code without leaving your editor. Get instant geolocation, network information, security insights, and more.

---

##  Features

- **IP Geolocation** - Country, city, coordinates, and location metadata
- **Network & ASN Information** - ISP, organization, autonomous system details
- **Currency Information** - Currency code, symbol, and exchange rates
- **Time Zone Data** - Current time, UTC offset, and DST information
- **User-Agent Parsing** - Browser, OS, and device detection
- **Security Intelligence** - Proxy/VPN detection, threat scoring (Advanced plan only)
- **Abuse Contact Info** - Network abuse contacts and reporting information (Advanced plan only)

### Multiple Inspection Workflows

- **Command Palette** - Quick IP lookup via command
- **Context Menu** - Right-click on any IP address
- **Hover Inspect** - Click "Inspect IP" in hover tooltips
- **Clipboard Inspect** - Check IPs directly from clipboard

---

##  Requirements

A valid **ipgeolocation.io API key** is required.

Get your free API key at: [ipgeolocation.io](https://ipgeolocation.io)

---

##  Quick Start

### 1. Install the Extension

Install from the [Visual Studio Marketplace](https://marketplace.visualstudio.com) or search for "IPGeolocation Inspector" in VS Code.

### 2. Set Your API Key (One-Time Setup)

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: `IPGeolocation: Set API Key`
3. Paste your API key

Your key is stored securely using VS Code Secret Storage.

### 3. Start Inspecting

Select any IP address and right-click → `IPGeolocation: Inspect IP`

---

##  Usage

### Method 1: Command Palette

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: `IPGeolocation: Inspect IP`
3. Enter an IP address when prompted

### Method 2: Context Menu

1. **Select** an IP address in any file, OR
2. **Place cursor** on an IP address
3. **Right-click** and choose `IPGeolocation: Inspect IP`

The extension automatically detects the IP from your selection or cursor position.

### Method 3: Hover Inspect

1. Hover over any IP address in your code/logs
2. Click the **"Inspect IP"** link in the tooltip

Works great for:
- Server logs
- JSON responses
- Configuration files
- Network traces

### Method 4: Clipboard Inspect

1. Copy an IP address to clipboard
2. Run: `IPGeolocation: Inspect Clipboard`

No manual pasting required.

---

## Output

Results are displayed in a dedicated **Output Channel** with clean, readable formatting:

```
══════════════════════════════════════════
IP Geolocation Results
══════════════════════════════════════════
IP: 8.8.8.8
Timestamp: 2024-01-15 14:30:22

──────────────────────────────────────────
Location
──────────────────────────────────────────
Country: United States
City: Mountain View
State: California
Latitude: 37.4056
Longitude: -122.0775

──────────────────────────────────────────
Network
──────────────────────────────────────────
ISP: Google LLC
Organization: Google Public DNS
ASN: AS15169
Hostname: dns.google

──────────────────────────────────────────
Time Zone
──────────────────────────────────────────
Name: America/Los_Angeles
Offset: UTC-08:00
Current Time: 2024-01-15 06:30:22
```


---

##  Subscription Plans & Data Availability

The data returned depends on your **ipgeolocation.io subscription plan**:

| Plan | Available Data |
|------|----------------|
| **Free** | Basic location, country metadata, currency |
| **Standard** | + Hostname, network (ASN/ISP), time zone, user-agent |
| **Advanced** | + Security intelligence, abuse contacts, extended fields |


---

##  Advanced Configuration

### Response Filtering

Control which data is returned using VS Code settings. These map directly to the ipgeolocation.io API parameters.

#### 1. `fields` - Include Only Specific Fields

Limit the response to specific fields:

```json
{
  "ipgeolocation.fields": "ip,location.country_name,location.city,network.asn"
}
```

#### 2. `exclude` - Remove Unwanted Fields

Exclude specific data from responses:

```json
{
  "ipgeolocation.excludes": "currency,country_metadata"
}
```

#### 3. `include` - Enable Additional Modules

**Important:** Some data modules are **not returned by default**, even on paid plans. You must explicitly enable them.

### Data Modules Requiring `include` Parameter

#### Security Intelligence (Advanced Plan Only)

Not returned by default. Enable with:

```json
{
  "ipgeolocation.include": "security"
}
```

**Returns:**
- Threat score
- Proxy/VPN/TOR detection
- Known attacker flags
- Cloud provider detection

#### Abuse Contact Information (Advanced Plan Only)

Enable abuse data:

```json
{
  "ipgeolocation.include": "abuse"
}
```

**Returns:**
- Abuse contact emails
- Phone numbers
- Organization details
- Network route information

#### Hostname Lookup (Paid Plans)

Not enabled by default. Three options available:

```json
{
  "ipgeolocation.include": "hostname"
}
```

```json
{
  "ipgeolocation.include": "liveHostname"
}
```

```json
{
  "ipgeolocation.include": "hostnameFallbackLive"
}
```

#### Time Zone Information (Standard & Advanced)

Enable time zone data:

```json
{
  "ipgeolocation.include": "time_zone"
}
```

#### User-Agent Parsing (Paid Plans)

Enable user-agent information:

```json
{
  "ipgeolocation.include": "user_agent"
}
```

#### DMA Code (Advanced Plan Only)

Enable DMA (Designated Market Area) codes for US marketing/targeting:

```json
{
  "ipgeolocation.include": "dma"
}
```

### Enable Multiple Modules

Combine multiple modules with commas:

```json
{
  "ipgeolocation.include": "hostname,security,abuse,time_zone,user_agent"
}
```

**Note:** Unsupported modules (based on your plan) are silently ignored by the API.

---

##  Security & Privacy

- API keys are stored using **VS Code Secret Storage**
- Keys are **never logged or exposed**
- All requests go **directly to ipgeolocation.io**
- No data is collected or stored by this extension

---

##  Extension Settings

Access settings via: `File > Preferences > Settings` and search for "ipgeolocation"

| Setting | Description | Default |
|---------|-------------|---------|
| `ipgeolocation.fields` | Specific fields to include in response | `""` (all) |
| `ipgeolocation.excludes` | Fields to exclude from response | `""` (none) |
| `ipgeolocation.include` | Additional data modules to enable | `""` (none) |

---

##  Troubleshooting

### "Invalid API Key" Error

1. Verify your API key at [ipgeolocation.io](https://ipgeolocation.io)
2. Run: `IPGeolocation: Set API Key` to update
3. Restart VS Code if the issue persists

### Missing Data Fields

- Check your subscription plan supports the requested data
- Verify you've enabled the appropriate `include` modules
- Some IPs naturally lack certain information (e.g., private IPs)

### No Response

- Check your internet connection
- Verify API rate limits haven't been exceeded
- Check VS Code Output panel for error details

---

## Support

- **GitHub Issues**: [https://github.com/ipgeolocation/ipgeolocation-inspector/issues](https://github.com/ipgeolocation/ipgeolocation-inspector/issues)
- **Email**: support@ipgeolocation.io
- [**IP Location API Documentation**](https://ipgeolocation.io/ip-location-api.html#documentation-overview)
- [**IP Security API Documentation**](https://ipgeolocation.io/ip-security-api.html#documentation-overview)
- [**Pricing**](https://ipgeolocation.io/pricing.html)

---

**Built and maintained by [ipgeolocation.io](https://ipgeolocation.io)**