import { getRouteApi } from '@tanstack/react-router';
import ClusterCard from '@/features/organization/components/ClusterCard';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetOrganization } from "@/features/organization/queries/useGetOrganization";
import { useState } from 'react';
import NewClusterModal from '@/features/clusters/modals/NewCluster';

const route = getRouteApi('');

function Clusters() {
	const [isNewClusterModalOpen, setIsNewClusterModalOpen] = useState(false);
	const  { organizationId } = route.useParams();
	const { data: orgInfo, isLoading, isError, isSuccess } = useGetOrganization(organizationId);

	return (
		<div>
			  <section>
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row justify-between mb-10">
          <div>
            <Input placeholder="Filter clusters by name" className="w-3/5 md:w-64 inline-block" />
            <Button className="inline-block w-2/5 md:w-auto md:ml-4">
              Sort by A-Z
              <span>
                <ChevronDown className="inline-block" />
              </span>
            </Button>
          </div>
          {/* <Button variant="positive" className="rounded-full md:w-44" onClick={() => {
            setIsNewClusterModalOpen(true);
          }}>
            <Plus />
            New Cluster
          </Button> */}
					<NewClusterModal />
        </div>
      </section>
      <section>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">	
				<div className="cols-span-1 md:col-span-4 lg:col-span-3 2xl:col-span-2">
					<ClusterCard
						clusterName="Cluster 1"
						clusterId="cluster-1"
						organizationId={organizationId}
					/>
				</div>
      </div>
      </section>
		</div>
	);
}

export default Clusters;
