import {useState, useEffect} from "react"
import Layout from "../components/Layout"
import Head from "next/head"
import PageHeader from "../components/PageHeader"
import fetch from "isomorphic-unfetch"
import {ColumnsWithDivider, Column} from "../components/ColumnsWithDivider"
import Button from "../components/Button"
import DetailMap from "../components/Maps/DetailMap"
import ServiceDetailItem from "../components/ServiceDetailItem"
import CentredText from "../components/CentredText"
import ServiceSuitabilityPanel from "../components/ServiceSuitabilityPanel"
import {prettyDays} from "../lib/utils"
import ShareDialog from "../components/ShareDialog"
import "./detail.scss"
import {isFavourited, addFavourite as addToStorage, removeFavourite as removeFromStorage} from "../lib/localStorage"

const DetailPage = ({service}) =>{

    const [favourited, setFavourited] = useState(false)

    const addFavourite = () => {
        addToStorage(service)
        setFavourited(isFavourited(service.assetId))
    }

    // useEffect(()=>{
    //     console.log("running effect...")
    //     setFavourited(isFavourited(service.assetId))
    // }, [favourited])

    let {
        name, 
        parentOrganisation, 
        venue, 
        area, 
        postcode, 
        description, 
        url, 
        phone, 
        contactName, 
        email, 
        // geo, 
        days, 
        frequency,
        suitability,
        accessibility,
        price,
        ageGroups
    } = service

    const [shareDialogOpen, toggleShareDialog] = useState(false)

    return(
        <Layout withHeader withFooter>
            <Head>
                <title>{(name || parentOrganisation)} | Care and support for adults | Buckinghamshire County Council</title>
            </Head>
            <PageHeader 
                breadcrumbs={[
                    {
                        title: "Care for adults",
                        href: "/"
                    },
                    {
                        title: "Service detail"
                    },
                ]}
                title={name || parentOrganisation}
                lede={description}
            />  
            <ColumnsWithDivider>
                <Column>
                    {url && <Button withBottomMargin href={url}>Visit website</Button>}
                    {(venue || area || postcode) &&
                        <ServiceDetailItem kind="place">
                            {venue && <p>{venue}</p>}
                            {area && <p>{area}</p>}
                            {postcode && <p>{postcode}</p>}
                            <a href={`https://www.google.com/maps/place/${service.postcode}/@${service.geo.coordinates[1]},${service.geo.coordinates[0]},15z`}>Get directions</a>
                        </ServiceDetailItem>
                    }
                    {(days.length > 0 || frequency) &&
                        <ServiceDetailItem kind="calendar">

                            {days.length > 0 && prettyDays(days)}
                            {frequency && <p>{frequency}</p>}
                        </ServiceDetailItem>
                    }
                    {(contactName || phone || email) &&
                        <ServiceDetailItem kind="contact">
                            {contactName && <p>{contactName}</p>}
                            {phone && <p>{phone}</p>}
                            {email && <a href={`mailto:${email}`}>{email}</a>}
                        </ServiceDetailItem>                    
                    }
                </Column>
                <Column>
                    <div className="detail__actions">
                        <button className="share-button" onClick={()=>{
                            toggleShareDialog(true)
                        }}>Share</button>
                    </div>


                    {favourited ? "true" : "false"}

                    {favourited ?
                        <button onClick={()=>{
                            // removeFavourite(service.assetId)
                        }}>Remove from saved</button>
                        :
                        <button onClick={addFavourite}>Save for later</button>
                    }

                    <DetailMap
                        category={service.category}
                        coordinates={service.geo.coordinates}
                    />
                    {/* <em>Approximate location only. Always check the website or contact the organiser first.</em> */}
                </Column>
            </ColumnsWithDivider>
            <ServiceSuitabilityPanel
                accessibility={accessibility}
                ages={ageGroups}
                suitability={suitability}
                price={price}
            />
            <CentredText
                title="Is anything missing?"
                description="If there’s anything out of date or missing from this service, you can request it be updated."
            />
            <ShareDialog dialogIsOpen={shareDialogOpen} toggleDialog={toggleShareDialog}/>

        </Layout>
    )
}
    

DetailPage.getInitialProps = async ({req, query}) => {
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : ""
    let res = await fetch(`${baseUrl}/api/services/${query.id}`)
    let service = await res.json()
    return {
        service: service.result
    }
}

export default DetailPage