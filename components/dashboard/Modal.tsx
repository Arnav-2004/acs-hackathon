import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  Linking
} from 'react-native';
import {
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import { IconsUser } from './IconUser';

const { width, height } = Dimensions.get('window');

// This component replaces the IconsUser component
export const ProfileModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState(
    {
        "0": {
          "description": "Threat actors have been exploiting a security vulnerability in Paragon Partition Manager's BioNTdrv.sys driver in ransomware attacks to escalate privileges and execute arbitrary code.  The zero-day flaw (CVE-2025-0289) is part of a set of five vulnerabilities that was discovered by Microsoft, according to the CERT Coordination Center (CERT/CC).  \"These include arbitrary kernel memory mapping and write vulnerabilities, a null pointer dereference, insecure kernel resource access, and an arbitrary memory move vulnerability,\" CERT/CC said .   In a hypothetical attack scenario, an adversary with local access to a Windows machine can exploit these shortcomings to escalate privileges or cause a denial-of-service (DoS) condition by taking advantage of the fact that \"BioNTdrv.sys\" is signed by Microsoft.  This could also pave the way for what's called a Bring Your Own Vulnerable Driver ( BYOVD ) attack on systems where the driver is not installed, thereby allowing t...",
          "link": "https://thehackernews.com/2025/03/hackers-exploit-paragon-partition.html",
          "title": "Hackers Exploit Paragon Partition Manager Driver Vulnerability in Ransomware Attacks"
        },
        "1": {
          "description": "In 2024, global ransomware attacks hit 5,414, an 11% increase from 2023.\u00a0   After a slow start, attacks spiked in Q2 and surged in Q4, with 1,827 incidents (33% of the year's total). Law enforcement actions against major groups like LockBit caused fragmentation,  leading to more competition and a rise in smaller gangs.  The number of active ransomware  groups jumped 40%, from 68 in 2023 to 95 in 2024.   New Ransomware Groups to Watch  In 2023 there were just 27 new groups. 2024 saw a dramatic rise with 46 new groups detected. As the year went on the number of groups accelerated with Q4 2024 having 48 groups active.\u00a0  Of the 46 new ransomware groups in 2024, RansomHub became dominant, exceeding LockBit's activity. At Cyberint, now a Check Point Company, the research team is constantly researching the latest ransomware groups  and analyzing them for potential impact. This blog will look at 3 new players, the aforementioned RansomHub, Fog and Lynx and examine their impact in 202...",
          "link": "https://thehackernews.com/2025/03/the-new-ransomware-groups-shaking-up.html",
          "title": "The New Ransomware Groups Shaking Up 2025"
        },
        "2": {
          "description": "Ransomware doesn't hit all at once\u2014it slowly floods your defenses in stages. Like a ship subsumed with water, the attack starts quietly, below the surface, with subtle warning signs that are easy to miss. By the time encryption starts, it's too late to stop the flood.\u00a0 Each stage of a ransomware attack offers a small window to detect and stop the threat before it's too late. The problem is most organizations aren't monitoring for early warning signs - allowing attackers to quietly disable backups, escalate privileges, and evade detection until encryption locks everything down. By the time the ransomware note appears, your opportunities are gone.\u00a0 Let's unpack the stages of a ransomware attack, how to stay resilient amidst constantly morphing indicators of compromise (IOCs), and why constant validation of your defense is a must to stay resilient. The Three Stages of a Ransomware Attack - and How to Detect It Ransomware attacks don't happen instantly. Attackers follow a st...",
          "link": "https://thehackernews.com/2025/02/becoming-ransomware-ready-why.html",
          "title": "Becoming Ransomware Ready: Why Continuous Validation Is Your Best Defense"
        },
        "3": {
          "description": "A new malware campaign has been observed targeting edge devices from Cisco, ASUS, QNAP, and Synology to rope them into a botnet named PolarEdge since at least the end of 2023.  French cybersecurity company Sekoia said  it observed the unknown threat actors deploying a backdoor by leveraging CVE-2023-20118  (CVSS score: 6.5), a critical security flaw impacting Cisco Small Business RV016, RV042, RV042G, RV082, RV320, and RV325 Routers that could result in arbitrary command execution on susceptible devices.  The vulnerability remains unpatched due to the routers reaching end-of-life (EoL) status. As workarounds, Cisco recommended in early 2023 that the flaw can be mitigated by disabling remote management and blocking access to ports 443 and 60443.  In the attack registered against Sekoia's honeypots, the vulnerability is said to have been used to deliver a previously undocumented implant, a TLS backdoor that incorporates the ability to listen for incoming client connections and execu...",
          "link": "https://thehackernews.com/2025/02/polaredge-botnet-exploits-cisco-and.html",
          "title": "PolarEdge Botnet Exploits Cisco and Other Flaws to Hijack ASUS, QNAP, and Synology Devices"
        },
        "4": {
          "description": "A cross-site scripting (XSS) vulnerability in a virtual tour framework has been weaponized by malicious actors to inject malicious scripts across hundreds of websites with the goal of manipulating search results and fueling a spam ads campaign at scale.  Security researcher Oleg Zaytsev, in a report shared with The Hacker News, said the campaign \u2013 dubbed 360XSS  \u2013 affected over 350 websites, including government portals, U.S. state government sites, American universities, major hotel chains, news outlets, car dealerships, and several Fortune 500 companies.  \"This wasn't just a spam operation,\" the researcher said . \"It was an industrial-scale abuse of trusted domains.\"  All these websites have one thing in common: A popular framework called Krpano  that's used to embed 360\u00b0 images and videos to facilitate interactive virtual tours and VR experiences.\u00a0  Zaytsev said he stumbled upon the campaign after coming across a pornography-related ad listed on Google ...",
          "link": "https://thehackernews.com/2025/02/hackers-exploited-krpano-framework-flaw.html",
          "title": "Hackers Exploited Krpano Framework Flaw to Inject Spam Ads on 350+ Websites"
        },
        "5": {
          "description": "The Computer Emergency Response Team of Ukraine (CERT-UA) on Tuesday warned of renewed activity from an organized criminal group it tracks as UAC-0173 that involves infecting computers with a remote access trojan named DCRat  (aka DarkCrystal RAT).  The Ukrainian cybersecurity authority said it observed the latest attack wave starting in mid-January 2025. The activity is designed to target the Notary of Ukraine.  The infection chain leverages phishing emails that claim to be sent on behalf of the Ministry of Justice of Ukraine, urging recipients to download an executable, which, when launched, leads to the deployment of the DCRat malware. The binary is hosted in Cloudflare's R2  cloud storage service.   \"Having thus provided primary access to the notary's automated workplace, the attackers take measures to install additional tools, in particular, RDPWRAPPER, which implements the functionality of parallel RDP sessions, which, in combination with the use of the BORE utility...",
          "link": "https://thehackernews.com/2025/02/cert-ua-warns-of-uac-0173-attacks.html",
          "title": "CERT-UA Warns of UAC-0173 Attacks Deploying DCRat to Compromise Ukrainian Notaries"
        },
        "6": {
          "description": "The U.S. Cybersecurity and Infrastructure Security Agency (CISA) on Tuesday placed  two security flaws impacting Microsoft Partner Center and Synacor Zimbra Collaboration Suite (ZCS) to its Known Exploited Vulnerabilities ( KEV ) catalog, based on evidence of active exploitation.  The vulnerabilities in question are as follows -   CVE-2024-49035  (CVSS score: 8.7) - An improper access control vulnerability in Microsoft Partner Center that allows an attacker to escalate privileges. (Fixed in November 2024 )    CVE-2023-34192  (CVSS score: 9.0) - A cross-site scripting (XSS) vulnerability in Synacor ZCS that allows a remote authenticated attacker to execute arbitrary code via a crafted script to the /h/autoSaveDraft function. (Fixed in July 2023  with version 8.8.15 Patch 40)    Last year, Microsoft acknowledged that CVE-2024-49035 had been exploited in the wild, but did not reveal any additional details on how it was weaponized in real-world attacks. There are currently no public repor...",
          "link": "https://thehackernews.com/2025/02/cisa-adds-microsoft-and-zimbra-flaws-to.html",
          "title": "CISA Adds Microsoft and Zimbra Flaws to KEV Catalog Amid Active Exploitation"
        },
        "7": {
          "description": "A large-scale malware campaign has been found leveraging a vulnerable Windows driver associated with Adlice's product suite to sidestep detection efforts and deliver the Gh0st RAT malware .  \"To further evade detection, the attackers deliberately generated multiple variants (with different hashes) of the 2.0.2 driver by modifying specific PE parts while keeping the signature valid,\" Check Point said  in a new report published Monday.  The cybersecurity company said the malicious activity involved thousands of first-stage malicious samples that are used to deploy a program capable of terminating endpoint detection and response (EDR) software by means of what's called a bring your own vulnerable driver ( BYOVD ) attack.  As many as 2,500 distinct variants of the legacy version 2.0.2 of the vulnerable RogueKiller Antirootkit Driver, truesight.sys, have been identified on the VirusTotal platform, although the number is believed to be likely higher. The EDR-killer module...",
          "link": "https://thehackernews.com/2025/02/2500-truesightsys-driver-variants.html",
          "title": "2,500+ Truesight.sys Driver Variants Exploited to Bypass EDR and Deploy HiddenGh0st RAT"
        },
        "8": {
          "description": "The U.S. Cybersecurity and Infrastructure Security Agency (CISA) has added  two security flaws impacting Adobe ColdFusion and Oracle Agile Product Lifecycle Management (PLM) to its Known Exploited Vulnerabilities ( KEV ) catalog, based on evidence of active exploitation.  The vulnerabilities in question are listed below -   CVE-2017-3066  (CVSS score: 9.8) - A deserialization vulnerability impacting Adobe ColdFusion in the Apache BlazeDS library that allows for arbitrary code execution. (Fixed in April 2017 )  CVE-2024-20953  (CVSS score: 8.8) - A deserialization vulnerability impacting Oracle Agile PLM that allows a low-privileged attacker with network access via HTTP to compromise the system. (Fixed in January 2024 )   There are currently no public reports referencing the exploitation of the vulnerabilities, although another flaw impacting Oracle Agile PLM ( CVE-2024-21287 , CVSS score: 7.5) came under active abuse late last year.   To mitigate the risks posed by potential attacks w...",
          "link": "https://thehackernews.com/2025/02/two-actively-exploited-security-flaws.html",
          "title": "Two Actively Exploited Security Flaws in Adobe and Oracle Products Flagged by CISA"
        },
        "9": {
          "description": "Cybersecurity researchers are warning of a new campaign that leverages cracked versions of software as a lure to distribute information stealers like Lumma and ACR Stealer.  The AhnLab Security Intelligence Center (ASEC) said it has observed a spike in the distribution volume of ACR Stealer since January 2025.  A notable aspect of the stealer malware is the use of a technique called dead drop resolver  to extract the actual command-and-control (C2) server. This includes relying on legitimate services like Steam, Telegram's Telegraph, Google Forms, and Google Slides.  \"Threat actors enter the actual C2 domain in Base64 encoding on a specific page,\" ASEC said . \"The malware accesses this page, parses the string, and obtains the actual C2 domain address to perform malicious behaviors.\"   ACR Stealer, previously distributed  via Hijack Loader malware, is capable of harvesting a wide range of information from compromised systems, including files, web browser data, ...",
          "link": "https://thehackernews.com/2025/02/new-malware-campaign-uses-cracked.html",
          "title": "New Malware Campaign Uses Cracked Software to Spread Lumma and ACR Stealer"
        },
        "10": {
          "description": "Cisco has confirmed that a Chinese threat actor known as Salt Typhoon gained access by likely abusing a known security flaw tracked as CVE-2018-0171 , and by obtaining legitimate victim login credentials as part of a targeted campaign aimed at major U.S. telecommunications companies.  \"The threat actor then demonstrated their ability to persist in target environments across equipment from multiple vendors for extended periods, maintaining access in one instance for over three years,\" Cisco Talos said , describing the hackers as highly sophisticated and well-funded.   \"The long timeline of this campaign suggests a high degree of coordination, planning, and patience \u2014 standard hallmarks of advanced persistent threat (APT) and state-sponsored actors.\"  The networking equipment major said it found no evidence that other known security bugs have been weaponized by the hacking crew, contrary to a recent report from Recorded Future that revealed  exploitation attempts inv...",
          "link": "https://thehackernews.com/2025/02/cisco-confirms-salt-typhoon-exploited.html",
          "title": "Cisco Confirms Salt Typhoon Exploited CVE-2018-0171 to Target U.S. Telecom Networks"
        },
        "11": {
          "description": "A high-severity security flaw impacting the Craft content management system (CMS) has been added  by the U.S. Cybersecurity and Infrastructure Security Agency (CISA) to its Known Exploited Vulnerabilities ( KEV ) catalog, based on evidence of active exploitation.  The vulnerability in question is CVE-2025-23209  (CVSS score: 8.1), which impacts Craft CMS versions 4 and 5. It was addressed by the project maintainers in late December 2024 in versions 4.13.8 and 5.5.8.  \"Craft CMS contains a code injection vulnerability that allows for remote code execution as vulnerable versions have compromised user security keys,\" the agency said.   The vulnerability affects the following version of the software -   >= 5.0.0-RC1, < 5.5.5  >= 4.0.0-RC1, < 4.13.8   In an advisory released  on GitHub, Craft CMS noted that all unpatched versions of Craft with a compromised security key are impacted by the security defect.  \"If you can't update to a patched version, then rota...",
          "link": "https://thehackernews.com/2025/02/cisa-flags-craft-cms-vulnerability-cve.html",
          "title": "CISA Flags Craft CMS Vulnerability CVE-2025-23209 Amid Active Attacks"
        },
        "12": {
          "description": "A previously unknown threat activity cluster targeted European organizations, particularly those in the healthcare sector, to deploy PlugX and its successor, ShadowPad, with the intrusions ultimately leading to deployment of a ransomware called NailaoLocker in some cases.  The campaign, codenamed Green Nailao by Orange Cyberdefense CERT, involved the exploitation of a now-patched security flaw in Check Point network gateway security products ( CVE-2024-24919 , CVSS score: 7.5). The attacks were observed between June and October 2024.  \"The campaign relied on DLL search-order hijacking to deploy ShadowPad and PlugX \u2013 two implants often associated with China-nexus targeted intrusions,\" the company said  in a technical report shared with The Hacker News.   The initial access afforded by exploitation of vulnerable Check Point instances is said to have allowed the threat actors to retrieve user credentials and to connect to the VPN using a legitimate account.  In the next stage,...",
          "link": "https://thehackernews.com/2025/02/chinese-linked-attackers-exploit-check.html",
          "title": "China-Linked Attackers Exploit Check Point Flaw to Deploy ShadowPad and Ransomware"
        },
        "13": {
          "description": "Citrix has released security updates for a high-severity security flaw impacting NetScaler Console (formerly NetScaler ADM) and NetScaler Agent that could lead to privilege escalation under certain conditions.  The vulnerability, tracked as CVE-2024-12284 , has been given a CVSS v4 score of 8.8 out of a maximum of 10.0.  It has been described as a case of improper privilege management that could result in authenticated privilege escalation if the NetScaler Console Agent is deployed and allows an attacker to execute post-compromise actions.  \"The issue arises due to inadequate privilege management and could be exploited by an authenticated malicious actor to execute commands without additional authorization,\" Netscaler noted .  \"However, only authenticated users with existing access to the NetScaler Console can exploit this vulnerability, thereby limiting the threat surface to only authenticated users.\"   The shortcoming affects the below versions -   NetScaler Cons...",
          "link": "https://thehackernews.com/2025/02/citrix-releases-security-fix-for.html",
          "title": "Citrix Releases Security Fix for NetScaler Console Privilege Escalation Vulnerability"
        },
        "14": {
          "description": "Microsoft has released security updates to address two Critical-rated flaws impacting Bing and Power Pages, including one that has come under active exploitation in the wild.  The vulnerabilities are listed below -   CVE-2025-21355  (CVSS score: 8.6) - Microsoft Bing Remote Code Execution Vulnerability  CVE-2025-24989  (CVSS score: 8.2) - Microsoft Power Pages Elevation of Privilege Vulnerability   \"Missing Authentication for Critical Function in Microsoft Bing allows an unauthorized attacker to execute code over a network,\" the tech giant said in an advisory for CVE-2025-21355. No customer action is required.   On the other hand, CVE-2025-24989 concerns a case of improper access control in Power Pages , a low-code platform for creating, hosting, and managing secure business websites, that an unauthorized attacker could exploit to elevate privileges over a network and bypass user registration control.  Microsoft, which credited its own employee Raj Kumar for flagging the vul...",
          "link": "https://thehackernews.com/2025/02/microsoft-patches-actively-exploited.html",
          "title": "Microsoft Patches Actively Exploited Power Pages Privilege Escalation Vulnerability"
        },
        "15": {
          "description": "The U.S. Cybersecurity and Infrastructure Security Agency (CISA) on Tuesday added  two security flaws impacting Palo Alto Networks PAN-OS and SonicWall SonicOS SSLVPN to its Known Exploited Vulnerabilities ( KEV ) catalog, based on evidence of active exploitation.  The flaws are listed below -   CVE-2025-0108  (CVSS score: 7.8) - An authentication bypass vulnerability in the Palo Alto Networks PAN-OS management web interface that allows an unauthenticated attacker with network access to the management web interface to bypass the authentication normally required and invoke certain PHP scripts  CVE-2024-53704  (CVSS score: 8.2) - An improper authentication vulnerability in the SSLVPN authentication mechanism that allows a remote attacker to bypass authentication    Palo Alto Networks has since confirmed to The Hacker News that it has observed active exploitation attempts against CVE-2025-0108, with the company noting that it could be chained with other vulnerabilities like CVE-2024-9474...",
          "link": "https://thehackernews.com/2025/02/cisa-adds-palo-alto-networks-and.html",
          "title": "CISA Adds Palo Alto Networks and SonicWall Flaws to Exploited Vulnerabilities List"
        },
        "16": {
          "description": "Two security vulnerabilities have been discovered in the OpenSSH secure networking utility suite that, if successfully exploited, could result in an active machine-in-the-middle (MitM) and a denial-of-service (DoS) attack, respectively, under certain conditions.  The vulnerabilities, detailed  by the Qualys Threat Research Unit (TRU), are listed  below -   CVE-2025-26465 (CVSS score: 6.8) \u00a0- The OpenSSH client contains a logic error between versions 6.8p1 to 9.9p1 (inclusive) that makes it vulnerable to an active MitM attack if the VerifyHostKeyDNS option is enabled, allowing a malicious interloper to impersonate a legitimate server when a client attempts to connect to it (Introduced in December 2014)  CVE-2025-26466 (CVSS score: 5.9)  - The\u00a0OpenSSH client and server are vulnerable to a pre-authentication DoS attack between versions 9.5p1 to 9.9p1 (inclusive) that causes memory and CPU consumption (Introduced in August 2023)   \"If an attacker can perform a man-in-the-middle a...",
          "link": "https://thehackernews.com/2025/02/new-openssh-flaws-enable-man-in-middle.html",
          "title": "New OpenSSH Flaws Enable Man-in-the-Middle and DoS Attacks \u2014 Patch Now"
        },
        "17": {
          "description": "Juniper Networks has released security updates to address a critical security flaw impacting Session Smart Router, Session Smart Conductor, and WAN Assurance Router products that could be exploited to hijack control of susceptible devices.  Tracked as CVE-2025-21589 , the vulnerability carries a CVSS v3.1 score of 9.8 and a CVS v4 score of 9.3.  \"An Authentication Bypass Using an Alternate Path or Channel vulnerability in Juniper Networks Session Smart Router may allow a network-based attacker to bypass authentication and take administrative control of the device,\" the company said  in an advisory.  The vulnerability impacts the following products and versions -   Session Smart Router: From 5.6.7 before 5.6.17, from 6.0.8, from 6.1 before 6.1.12-lts, from 6.2 before 6.2.8-lts, and from 6.3 before 6.3.3-r2  Session Smart Conductor: From 5.6.7 before 5.6.17, from 6.0.8, from 6.1 before 6.1.12-lts, from 6.2 before 6.2.8-lts, and from 6.3 before 6.3.3-r2  WAN Assurance Managed R...",
          "link": "https://thehackernews.com/2025/02/juniper-session-smart-routers.html",
          "title": "Juniper Session Smart Routers Vulnerability Could Let Attackers Bypass Authentication"
        },
        "18": {
          "description": "Security vulnerabilities have been disclosed in Xerox VersaLink C7025 Multifunction printers (MFPs) that could allow attackers to capture authentication credentials via pass-back attacks via Lightweight Directory Access Protocol ( LDAP ) and SMB/FTP services.  \"This pass-back style attack leverages a vulnerability that allows a malicious actor to alter the MFP's configuration and cause the MFP device to send authentication credentials back to the malicious actor,\" Rapid7 security researcher Deral Heiland said .  \"If a malicious actor can successfully leverage these issues, it would allow them to capture credentials for Windows Active Directory. This means they could then move laterally within an organization's environment and compromise other critical Windows servers and file systems.\"   The identified vulnerabilities, which affect firmware versions 57.69.91 and earlier, are listed below -   CVE-2024-12510  (CVSS score: 6.7) - Pass-back attack via LDAP  CVE-202...",
          "link": "https://thehackernews.com/2025/02/new-xerox-printer-flaws-could-let.html",
          "title": "New Xerox Printer Flaws Could Let Attackers Capture Windows Active Directory Credentials"
        }
      } 
  );

  const openModal = async () => {
    setModalVisible(true);
    setLoading(true);
    
    // Simulate loading news data
    // Replace this with your actual API call later
    setTimeout(() => {
      // This is where you would fetch from your news API
      // const response = await fetch('your-news-api-url');
      // const data = await response.json();
      // setNewsData(data);
      
      setLoading(false);
    }, 1500);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNewsPress = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't open URL: ", err));
  };

  // Get current date for the news items that don't have a publishedAt property
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Component for the user icon that opens the modal
  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        style={styles.iconContainer}
        accessible={true}
        accessibilityLabel="Open news"
        accessibilityRole="button"
        accessibilityHint="Opens a modal with security news"
      >
        <View style={styles.userIcon}>
            <IconsUser />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security News Feed</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                accessible={true}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6722A8" />
                <Text style={styles.loadingText}>Loading news...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.newsContainer}
                showsVerticalScrollIndicator={false}
              >
                {Object.keys(newsData).map((key) => {
                  const item = newsData[key];
                  return (
                    <TouchableOpacity 
                      key={key}
                      style={styles.newsItem}
                      onPress={() => handleNewsPress(item.link)}
                    >
                      <Text style={styles.newsSource}>The Hacker News • {currentDate}</Text>
                      <Text style={styles.newsTitle}>{item.title}</Text>
                      <Text style={styles.newsDescription} numberOfLines={3}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginTop: 20,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#222',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#eee',
    marginTop: 16,
    fontFamily: 'Inter_500Medium',
  },
  newsContainer: {
    flex: 1,
    padding: 16,
  },
  newsItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  newsSource: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    marginBottom: 4,
  },
  newsTitle: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  newsDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
});